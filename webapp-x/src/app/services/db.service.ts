import { Injectable } from '@angular/core';

import { DB_CONFIG } from '@m-constants/db';
import { POUCHDB_OPTIONS } from '@m-constants/pouchdb';
import { Location } from '@m-services/location.service';
import { PouchDB } from '@m-services/pouchdb.service';
import { Session } from '@m-services/session.service';

@Injectable({
  providedIn: 'root'
})
export class DB {
  cache = {};
  isOnlineOnly: boolean;

  constructor(
    private location: Location,
    private pouchDB: PouchDB,
    private session: Session
  ) {
    this.isOnlineOnly = this.session.isOnlineOnly();

    if (!this.isOnlineOnly) {
      // delay the cleanup so it's out of the main startup sequence
      setTimeout(() => {
        this.getDB().viewCleanup();
        this.getDB({ meta: true }).viewCleanup();
      }, 1000);
    }
  }

  getUsername(remote) {
    const username = this.session.userCtx().name;

    if (!remote) {
      return username;
    }
    // escape username in case they user invalid characters
    return username.replace(DB_CONFIG.DISALLOWED_CHARS, match => `(${match.charCodeAt(0)})`);
  }

  getDbName(remote, meta, usersMeta) {
    const parts = [];

    if (remote) {
      parts.push(this.location.url);
    } else {
      parts.push(this.location.dbName);
    }

    if ((!remote || meta) && !usersMeta) {
      parts.push(DB_CONFIG.USER_DB_SUFFIX);
      parts.push(this.getUsername(remote));
    } else if (usersMeta) {
      parts.push(DB_CONFIG.USERS_DB_SUFFIX);
    }

    if (meta || usersMeta) {
      parts.push(DB_CONFIG.META_DB_SUFFIX);
    }

    return parts.join('-');
  };

  getParams(remote, meta, usersMeta) {
    const clone: any = remote ? Object.assign({}, POUCHDB_OPTIONS.remote) : Object.assign({}, POUCHDB_OPTIONS.local);

    if (remote && meta) {
      // Don't create user DBs remotely, we do this ourselves in /api/services/user-db:create,
      // which is called in routing when a user tries to access the DB
      clone.skip_setup = false;
    }

    if (remote && usersMeta) {
      clone.skip_setup = false;
    }

    return clone;
  }

  getDB({ remote = this.isOnlineOnly, meta = false, usersMeta = false } = {}) {
    const name = this.getDbName(remote, meta, usersMeta);

    if (!this.cache[name]) {
      this.cache[name] = this.pouchDB.get(name, this.getParams(remote, meta, usersMeta));
    }

    return this.cache[name];
  }
}
