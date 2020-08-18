export const POUCHDB_OPTIONS = Object.freeze({
  local: Object.freeze({ auto_compaction: true }),
  remote: Object.freeze({
    skip_setup: true,
    fetch: (url, opts) => {
      opts.headers.set('Accept', 'application/json');
      opts.credentials = 'same-origin';
      // @ts-ignore
      return window.PouchDB.fetch(url, opts);
    }
  })
});
