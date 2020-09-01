import { Injectable } from '@angular/core';
import { Db } from "./db.service";
import { Cache } from "./cache.service";

@Injectable({
  providedIn: 'root'
})
export class Settings {
  private cache;
  private readonly SETTINGS_ID = 'settings';

  constructor(
    private db: Db,
    private cacheService: Cache
  ) {
    this.cache = this.cacheService.register({
      get: (callback) => {
        this.db.get()
          .get(this.SETTINGS_ID)
          .then(function(doc) {
            callback(null, doc.settings);
          })
          .catch(callback);
      },
      invalidate: function(change) {
        return change.id === this.SETTINGS_ID;
      }
    });
  }

  get() {
    return new Promise((resolve, reject) => {
      this.cache((err, settings) => {
        if (err) {
          return reject(err);
        }

        resolve(settings);
      })
    });
  }
}

/*
(function () {

  'use strict';



  angular.module('inboxServices').factory('Settings',
    function(
      $log,
      $q,
      Cache,
      DB
    ) {

      'ngInject';



      return function() {
        const listeners = {};

        function emit(event, data) {
          if (listeners[event]) {
            listeners[event].forEach(function(callback) {
              try {
                callback(data);
              } catch(e) {
                $log.error('Error triggering listener callback.', event, data, callback);
              }
            });
          }
        }

        const deferred = $q(function(resolve, reject) {
          cache(function(err, settings) {
            if (err) {
              emit('error', err);
              return reject(err);
            }
            emit('change', settings);
            resolve(settings);
          });
        });

        deferred.on = function(event, callback) {
          if (!listeners[event]) {
            listeners[event] = [];
          }
          listeners[event].push(callback);

          return deferred;
        };

        return deferred;
      };
    }
  );

}());
*/
