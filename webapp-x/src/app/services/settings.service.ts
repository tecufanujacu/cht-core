import { Injectable } from '@angular/core';

import { Cache } from '@m-services/cache.service';
import { DB } from '@m-services/db.service';

@Injectable({
  providedIn: 'root'
})
export class Settings {
  SETTINGS_ID = 'settings';
  settingsCache: any;

  constructor(
    private db: DB,
    private cache: Cache
  ) {
    this.initCache();
  }

  initCache() {
    this.settingsCache =  this.cache.get({
      get: (callback) => {
        this.db.getDB()
          .get(this.SETTINGS_ID)
          .then((doc) => {
            callback(null, doc.settings);
          })
          .catch(callback);
      },
      invalidate: (change) => {
        return change.id === this.SETTINGS_ID;
      }
    });
  }

  emit(event, data, listeners) {
    if (listeners[event]) {
      listeners[event].forEach((callback) => {
        try {
          callback(data);
        } catch(e) {
          console.error('Error triggering listener callback.', event, data, callback);
        }
      });
    }
  }

  get() {
    const listeners = {};

    const deferred: any = new Promise((resolve, reject) => {
      this.settingsCache((err, settings) => {
        if (err) {
          this.emit('error', err, listeners);
          return reject(err);
        }
        this.emit('change', settings, listeners);
        resolve(settings);
      });
    });

    deferred.on = (event, callback) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);

      return deferred;
    };

    return deferred;
  }
}
