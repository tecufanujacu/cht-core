import { Injectable } from '@angular/core';

import { DB } from '@m-services/db.service';
import { DB_SYNC } from '@m-constants/db';

@Injectable({
  providedIn: 'root'
})
export class DbSyncRetry {

  constructor(
    private db: DB
  ) {}

  getPreviousRev(doc) {
    const revisions = doc._revisions;

    if (!revisions) {
      return;
    }

    if (revisions.start <= 1 || revisions.ids.length <= 1) {
      return;
    }

    return `${revisions.start - 1}-${revisions.ids[1]}`;
  }

  getMedicDoc(id) {
    return this.db
      .getDB()
      .get(id, { revs: true });
  }

  saveMedicDoc(doc) {
    delete doc._revisions;

    return this.db
      .getDB()
      .put(doc)
      .catch(err => {
        if (err.status !== 409) {
          throw err;
        }
    });
  }

  getLocalDoc(id) {
    return this.db
      .getDB({ meta: true })
      .get(`_local/${id}`)
      .catch(err => {
        if (err.status !== 404) {
          throw err;
        }

        return { _id: `_local/${id}` };
      })
      .then(doc => {
        doc.replication_retry = doc.replication_retry || {};
        doc.replication_retry.count = doc.replication_retry.count || 1;

        return doc;
      });
  }

  saveLocalDoc(local) {
    return this.db.getDB({ meta: true }).put(local);
  }

  // Retry replication for every "real" rev X times
  // we enable retrying by "touching" the doc, pushing it to the end of the changes feed
  // we store the rev of the doc we touch and we only increase the replication_retry if the calculated previous
  // rev matches the previous retry rev. This ensures that external updates (for example user updates) would reset
  // the retry counter.
  retryForbiddenFailure(err) {
    if (!err || !err.id) {
      return;
    }

    return Promise
      .all([
        this.getMedicDoc(err.id),
        this.getLocalDoc(err.id)
      ])
      .then(([ doc, local ]) => {
        if (local.replication_retry.rev) {
          const previousRev = this.getPreviousRev(doc);
          const consecutiveAttempts = previousRev && previousRev === local.replication_retry.rev;
          local.replication_retry.count = consecutiveAttempts ? local.replication_retry.count + 1 : 1;
        }

        if (local.replication_retry.count > DB_SYNC.MAX_REPLICATION_RETRY_COUNT) {
          return;
        }

        local.replication_retry.rev = doc._rev;
        // only save local doc if touching was successful: we catch conflicts when saving the medic doc
        return this.saveMedicDoc(doc).then(result => result && result.ok && this.saveLocalDoc(local));
      })
      .catch(err => {
        console.error(`Error when retrying replication for forbidden doc`, err);
      });
  }

}
