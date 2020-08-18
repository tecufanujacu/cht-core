// While we already do this earlier in inbox.js we have to check again for Karma
// tests as they don't hit that code
if (!(<any>window).startupTimes) {
  (<any>window).startupTimes = {};
}
(<any>window).startupTimes.firstCodeExecution = performance.now();

(<any>window).PouchDB = require('pouchdb-browser');
(<any>window).PouchDB.plugin(require('pouchdb-debug'));
(<any>window).$ = (<any>window).jQuery = require('jquery');
(<any>window).d3 = require('d3');

require('bootstrap');

