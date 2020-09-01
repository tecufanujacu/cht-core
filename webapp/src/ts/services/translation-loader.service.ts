const DEFAULT_LOCALE = 'en';
const DOC_ID_PREFIX = 'messages-';

import { Injectable } from "@angular/core";

import { Settings } from "../services/settings.service";

@Injectable({
  providedIn: 'root'
})
export class TranslationLoader {
  private readonly re = new RegExp(`^${DOC_ID_PREFIX}([a-zA-Z]+)$`);
  constructor(private settings:Settings) {}

  getLocale() {
    return this.settings.get().then((settings:any) => {
      return settings.locale || DEFAULT_LOCALE;
    });
  }

  test(docId) {
    return docId && this.re.test(docId);
  }

  getCode(docId) {
    if (!docId) {
      return false;
    }
    const match = docId.toString().match(this.re);
    return match && match[1];
  };
}
/*

angular.module('inboxServices').factory('TranslationLoader',
  function(
    $q,
    DB,
    Settings
  ) {
    'use strict';
    'ngInject';

    const getLocale = function(options) {
      if (options.key) {
        return $q.resolve(options.key);
      }

    };

    const mapTesting = function(doc) {
      Object.keys(doc).forEach(function(key) {
        doc[key] = '-' + doc[key] + '-';
      });
    };

    const service = (options) => {
      let testing = false;
      if (options.key === 'test') {
        options.key = 'en';
        testing = true;
      }
      return getLocale(options)
        .then(function(locale) {
          return DB().get(DOC_ID_PREFIX + locale);
        })
        .then(function(doc) {
          const values = Object.assign(doc.generic || {}, doc.custom || {});
          if (testing) {
            mapTesting(values);
          }
          return translationUtils.loadTranslations(values);
        })
        .catch(function(err) {
          if (err.status !== 404) {
            throw err;
          }
          return {};
        });
    };

    const re = new RegExp(`^${DOC_ID_PREFIX}([a-zA-Z]+)$`);
    service.test = docId => docId && re.test(docId);
    service.getCode = docId => {
      if (!docId) {
        return false;
      }
      const match = docId.toString().match(re);
      return match && match[1];
    };

    return service;
  }
);*/
