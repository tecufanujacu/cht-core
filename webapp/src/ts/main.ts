// While we already do this earlier in inbox.js we have to check again for Karma
// tests as they don't hit that code
if (!(<any>window).startupTimes) {
  (<any>window).startupTimes = {};
}
(<any>window).startupTimes.firstCodeExecution = performance.now();

(<any>window).PouchDB = require('pouchdb-browser').default;
(<any>window).PouchDB.plugin(require('pouchdb-debug'));
(<any>window).$ = (<any>window).jQuery = require('jquery');
//(<any>window).d3 = require('d3');

require('../../node_modules/select2/dist/js/select2.full');
require('bootstrap');
require('../js/bootstrap-multidropdown');
require('bootstrap-daterangepicker');
//require('nvd3');

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import { environment } from './environments/environment';
import { POUCHDB_OPTIONS } from "./constants";

require('moment');
require('moment/locale/bm');
require('moment/locale/es');
require('moment/locale/fr');
require('moment/locale/hi');
require('moment/locale/id');
require('moment/locale/ne');
require('moment/locale/sw');

const bootstrapper = require('../js/bootstrapper');
//const router = require('./router');

/*const KARMA_UNIT_TEST_PORT = '9876';

const minifySelected = selected => {
  const pathsToMinify = ['doc', 'formatted'];
  const lineageDocs = objectPath.get(selected, 'lineage', []);
  const docsToMinify = pathsToMinify
    .map(path => objectPath.get(selected, path))
    .filter(doc => doc)
    .concat(lineageDocs);

  docsToMinify.forEach(lineage.minify);
};
const makeSelectedLoggable = selected => {
  if (Array.isArray(selected)) {
    selected.forEach(minifySelected);
  } else if (selected) {
    minifySelected(selected);
  }
};
const createReduxLoggerConfig = Selectors => ({
  actionTransformer: function(action) {
    const loggableAction = cloneDeep(action);
    makeSelectedLoggable(loggableAction.payload && loggableAction.payload.selected);
    try {
      JSON.stringify(loggableAction);
    } catch(error) {
      loggableAction.payload = 'Payload is not serializable';
    }
    return loggableAction;
  },
  stateTransformer: function(state) {
    let loggableState = cloneDeep(state);
    ['Analytics', 'Contact', 'Conversation', 'Reports', 'Task'].forEach(module => {
      const fnName = 'getSelected' + module;
      makeSelectedLoggable(Selectors[fnName](loggableState));
    });
    try {
      JSON.stringify(loggableState);
    } catch(error) {
      loggableState = 'State is not serializable';
    }
    return loggableState;
  },
  collapsed: true
});
 */

(function() {
  'use strict';

  /*angular.module('inboxApp', [
    'ngRoute',
    'inboxControllers',
    'inboxDirectives',
    'inboxFilters',
    'inboxServices',
    'ipCookie',
    'ngRedux',
    'nvd3',
    'pascalprecht.translate',
    'pouchdb',
    'ui.bootstrap',
    uiRouter,
  ]);

  angular.module('inboxApp').config(function(
    $compileProvider,
    $locationProvider,
    $ngReduxProvider,
    $stateProvider,
    $translateProvider,
    $urlRouterProvider,
    RootReducer,
    Selectors
  ) {
    'ngInject';
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/error/404');
    router($stateProvider);
    $urlRouterProvider.when('', '/home');
    $urlRouterProvider.when('/messages/{uuid:[^:]*}', '/messages/contact:{uuid}');
    $translateProvider.useLoader('TranslationLoader', {});
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.addInterpolation('TranslationMessageFormatInterpolation');
    $translateProvider.addInterpolation('TranslationNullInterpolation');
    $translateProvider.useMissingTranslationHandlerLog();
    $compileProvider.aHrefSanitizationWhitelist(
      /^\s*(https?|ftp|mailto|tel|sms|file|blob):/
    );

    const isDevelopment = window.location.hostname === 'localhost' && window.location.port !== KARMA_UNIT_TEST_PORT;
    $compileProvider.debugInfoEnabled(isDevelopment);

    const middlewares = [reduxThunk];
    if (isDevelopment) {
      const reduxLogger = require('redux-logger');
      middlewares.push(reduxLogger.createLogger(createReduxLoggerConfig(Selectors)));
    }
    $ngReduxProvider.createStoreWith(RootReducer, middlewares);
  });*/

  //angular.module('inboxApp').constant('POUCHDB_OPTIONS', POUCHDB_OPTIONS);

  if (window.location.href === 'http://localhost:9876/context.html') {
    // karma unit testing - do not bootstrap
    return;
  }

  /*const ROUTE_PERMISSIONS = {
    tasks: 'can_view_tasks',
    messages: 'can_view_messages',
    contacts: 'can_view_contacts',
    analytics: 'can_view_analytics',
    reports: 'can_view_reports',
    'reports.edit': ['can_update_reports', 'can_view_reports']
  };

  const getRequiredPermissions = function(route) {
    return ROUTE_PERMISSIONS[route] || ROUTE_PERMISSIONS[route.split('.')[0]];
  };*/

  // Detects reloads or route updates (#/something)
  /*angular.module('inboxApp').run(function($state, $transitions, Auth) {
    $transitions.onBefore({}, function(trans) {
      if (trans.to().name.indexOf('error') === -1) {
        const permissions = getRequiredPermissions(trans.to().name);
        if (permissions && permissions.length) {
          return Auth.has(permissions).then(hasPermission => {
            if (!hasPermission) {
              $state.target('error', { code: 403 });
            }
          });
        }
      }
    });
  });*/

  bootstrapper(POUCHDB_OPTIONS, function(err) {
    if (err) {
      if (err.redirect) {
        window.location.href = err.redirect;
      } else {
        console.error('Error bootstrapping', err);
        setTimeout(function() {
          // retry initial replication automatically after one minute
          window.location.reload(false);
        }, 60 * 1000);
      }
      return;
    }
    (<any>window).startupTimes.bootstrapped = performance.now();
    /*angular.element(document).ready(function() {
      angular.bootstrap(document, ['inboxApp'], {
        strictDi: true,
      });
    });*/
    if (environment.production) {
      enableProdMode();
    }

    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });
})();
