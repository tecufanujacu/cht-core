import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PouchDB {
  // TODO: COMPLETE MIGRATION
  constructor() { }

  get(name, params) {
    // TODO this is replacement of >> pouchDB(name, this.getParams(remote, meta, usersMeta))
  }
}
