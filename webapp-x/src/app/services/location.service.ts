import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Location {
  location = window.location;
  dbName = 'medic';
  path = '/';
  adminPath = '/admin/';
  port = '';
  url = '';

  constructor() {
    this.port = this.location.port ? ':' + this.location.port : '';
    this.url = this.location.protocol + '//' + this.location.hostname + this.port + '/' + this.dbName;
  }

  get() {
    return {
      path: this.path,
      adminPath: this.adminPath,
      dbName: this.dbName,
      url: this.url
    };
  }
}
