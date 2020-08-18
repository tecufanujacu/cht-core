import { Injectable } from '@angular/core';

import { DB_SYNC } from '@m-constants/db';
import { DbDirection } from '@m-models/db-direction';
import { DB } from '@m-services/db.service';
import { Session } from '@m-services/session.service';
import { DbSyncRetry } from '@m-services/db-sync-retry.service';
import { Auth } from '@m-services/auth.service';
import { RulesEngine } from '@m-services/rules-engine.service';
import * as purger from '@m-bootstrapper/purger';

@Injectable({
  providedIn: 'root'
})
export class DBSync {
  inProgressSync: any; // Prevents multiple concurrent replications
  updateListeners = [];
  knownOnlineState = true; // Assume the user is online
  syncIsRecent = false; // True when a replication has succeeded within one interval
  intervalPromises = {
    sync: undefined,
    meta: undefined,
  };
  directions: DbDirection[];

  constructor(
    private db: DB,
    private session: Session,
    private dbSyncRetry: DbSyncRetry,
    private auth: Auth,
    private rulesEngine: RulesEngine
  ) {
    this.directions = this.defineDbDirectionsOptions();
  }

  // online users have potentially too much data so bypass local pouch
  isEnabled() {
    return !this.session.isOnlineOnly();
  }

  /**
   * Adds a listener function to be notified of replication state changes.
   *
   * @param listener {Function} A callback `function (update)`
   */
  addUpdateListener(listener) {
    this.updateListeners.push(listener);
  }

  /**
   * Boolean representing if sync is curently in progress
   */
  isSyncInProgress() {
    return !!this.inProgressSync;
  }

  /**
   * Set the current user's online status to control when replications will be attempted.
   *
   * @param onlineStatus {Boolean} The current online state of the user.
   */
  setOnlineStatus(onlineStatus) {
    if (this.knownOnlineState !== onlineStatus) {
      this.knownOnlineState = !!onlineStatus;

      if (this.knownOnlineState && !this.syncIsRecent) {
        this.resetSyncInterval();
        return this.syncLocalWithRemote();
      }
    }
  }

  /**
   * Synchronize the local database with the remote database.
   *
   * @returns Promise which resolves when both directions of the replication complete.
   */
  sync(force) {
    if (!this.isEnabled()) {
      this.sendUpdate({ state: 'disabled' });
      return Promise.resolve();
    }

    if (!this.intervalPromises.meta) {
      this.intervalPromises.meta = setInterval(this.syncMeta.bind(this), DB_SYNC.META_SYNC_INTERVAL);
      this.syncMeta();
    }

    this.resetSyncInterval();
    return this.syncLocalWithRemote(force);
  }

  /** Internal use functions **/

  defineDbDirectionsOptions(): DbDirection[] {
    const toOption = {
      name: 'to',
      options: {
        filter: this.readOnlyFilter,
        checkpoint: 'source',
      },
      allowed: () => this.auth.has('can_edit'),
      onDenied: (error) => this.dbSyncRetry.retryForbiddenFailure(error)
    };
    const fromOption = {
      name: 'from',
      options: {
        heartbeat: 10000, // 10 seconds
        timeout: 1000 * 60 * 10, // 10 minutes
      },
      allowed: () => Promise.resolve(true),
      onChange: (replicationResult) => this.rulesEngine.monitorExternalChanges(replicationResult)
    };

    return [ toOption, fromOption ];
  }

  readOnlyFilter(doc) {
    // Never replicate "purged" documents upwards
    const keys = Object.keys(doc);

    if (keys.length === 4 && keys.includes('_id') && keys.includes('_rev')
      && keys.includes('_deleted') && keys.includes('purged')) {
      return false;
    }

    // don't try to replicate read only docs back to the server
    return (
      DB_SYNC.READ_ONLY_TYPES.indexOf(doc.type) === -1
      && DB_SYNC.READ_ONLY_IDS.indexOf(doc._id) === -1
      && doc._id.indexOf(DB_SYNC.DDOC_PREFIX) !== 0
    );
  };

  replicate(direction, { batchSize = 100 } = {}) {
    const remote = this.db.getDB({ remote: true });
    const options = Object.assign({}, direction.options, { batch_size: batchSize });

    return this.db.getDB()
      .replicate[direction.name](remote, options)
      .on('change', replicationResult => {
        if (direction.onChange) {
          direction.onChange(replicationResult);
        }
      })
      .on('denied', (err) => {
        console.error(`Denied replicating ${direction.name} remote server`, err);

        if (direction.onDenied) {
          direction.onDenied(err);
        }
      })
      .on('error', (err) => {
        console.error(`Error replicating ${direction.name} remote server`, err);
      })
      .then(info => {
        console.debug(`Replication ${direction.name} successful`, info);
        return;
      })
      .catch(err => {
        if (err.code === 413 && direction.name === 'to' && batchSize > 1) {
          // @ts-ignore
          batchSize = parseInt(batchSize / 2);
          console.warn('Error attempting to replicate too much data to the server. ' +
            `Trying again with batch size of ${batchSize}`);

          return this.replicate(direction, { batchSize });
        }
        console.error(`Error replicating ${direction.name} remote server`, err);

        return direction.name;
      });
  }

  replicateIfAllowed(direction) {
    return direction
      .allowed()
      .then(allowed => {

      if (!allowed) {
        // not authorized to replicate - that's ok, skip silently
        return;
      }

      return this.replicate(direction);
    });
  }

  getCurrentSeq() {
    return this.db.getDB()
      .info()
      .then(info => info.update_seq + '');
  }

  getLastReplicatedSeq() {
    return window
      .localStorage
      .getItem(DB_SYNC.LAST_REPLICATED_SEQ_KEY);
  }

  syncLocalWithRemote(force?: any) {
    if (!this.knownOnlineState && !force) {
      return Promise.resolve();
    }

    if (!this.inProgressSync) {
      this.inProgressSync = Promise
        .all(this.directions.map(direction => this.replicateIfAllowed(direction)))
        .then(errs => {
          return this.getCurrentSeq().then(currentSeq => {
            errs = errs.filter(err => err);
            let update: any = { to: 'success', from: 'success' };

            if (!errs.length) {
              // no errors
              this.syncIsRecent = true;
              window.localStorage.setItem(DB_SYNC.LAST_REPLICATED_SEQ_KEY, currentSeq);
            } else if (currentSeq === this.getLastReplicatedSeq()) {
              // no changes to send, but may have some to receive
              update = { state: 'unknown' };
            } else {
              // definitely need to sync something
              errs.forEach(err => {
                update[err] = 'required';
              });
            }
            if (update.to === 'success') {
              // @ts-ignore
              window.localStorage.setItem(DB_SYNC.LAST_REPLICATED_DATE_KEY, Date.now());
            }
            this.sendUpdate(update);
          });
        })
        .finally(() => {
          this.inProgressSync = undefined;
        });
    }

    this.sendUpdate({ state: 'inProgress' });

    return this.inProgressSync;
  }

  syncMeta() {
    const remote = this.db.getDB({ meta: true, remote: true });
    const local = this.db.getDB({ meta: true });
    let currentSeq;
    local
      .info()
      .then(info => currentSeq = info.update_seq)
      .then(() => local.sync(remote))
      .then(() => purger.writePurgeMetaCheckpoint(local, currentSeq));
  }

  sendUpdate(update) {
    this.updateListeners.forEach(listener => listener(update));
  }

  resetSyncInterval() {
    if (this.intervalPromises.sync) {
      clearInterval(this.intervalPromises.sync);
      this.intervalPromises.sync = undefined;
    }

    this.intervalPromises.sync = setInterval(() => {
      this.syncIsRecent = false;
      this.syncLocalWithRemote();
    }, DB_SYNC.SYNC_INTERVAL);
  }

}
