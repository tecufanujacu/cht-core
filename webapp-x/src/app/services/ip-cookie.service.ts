import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpCookie {
  // TODO: COMPLETE MIGRATION
  constructor() { }

  get(name, action?: any, path?: any) {
    // TODO Implement, this is the equivalent of >> ipCookie(SESSION.COOKIE_NAME)
    // TODO also  >> ipCookie('login', 'force', { path: '/' })
  }

  remove(name, path) {
    // TODO Implement, this is the equivalent of >> ipCookie.remove(SESSION.COOKIE_NAME, { path: '/' })
  }
}
