import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from "lodash";

import { SESSION } from '@m-constants/session';
import { Location } from '@m-services/location.service';
import { IpCookie } from '@m-services/ip-cookie.service';

@Injectable({
  providedIn: 'root'
})
export class Session {
  userCtxCookieValue;

  constructor(
    private location: Location,
    private http: HttpClient,
    private ipCookie: IpCookie
  ) { }

  /**
   * Get the user context of the logged in user. This will return
   * null if the user is not logged in.
   */
  userCtx() {
    if (!this.userCtxCookieValue) {
      this.userCtxCookieValue = this.ipCookie.get(SESSION.COOKIE_NAME);
    }

    return this.userCtxCookieValue;
  }

  navigateToLogin() {
    console.warn('User must reauthenticate');
    this.ipCookie.remove(SESSION.COOKIE_NAME, { path: '/' });
    this.userCtxCookieValue = undefined;
    window.location.href = `/${this.location.dbName}/login?redirect=${encodeURIComponent(window.location.href)}`;
  }

  logout() {
    return this.http
      .delete('/_session')
      .toPromise()
      .catch(() => {
        // Set cookie to force login before using app
        this.ipCookie.get('login', 'force', { path: '/' });
      })
      .then(this.navigateToLogin.bind(this));
  }

  refreshUserCtx() {
    return this.http
      .get('/' + this.location.dbName + '/login/identity')
      .toPromise()
      .catch(() => {
        return this.logout();
      });
  }

  // Check current session
  init() {
    const userCtx = this.userCtx();

    if (!userCtx || !userCtx.name) {
      return this.logout();
    }

    return this.http
      .get('/_session')
      .toPromise()
      .then((response: any) => {
        const name = response.data &&
          response.data.userCtx &&
          response.data.userCtx.name;

        if (name !== userCtx.name) {
          // connected to the internet but server session is different
          return this.logout();
        }

        if (_.difference(userCtx.roles, response.data.userCtx.roles).length
          || _.difference(response.data.userCtx.roles, userCtx.roles).length) {
          return this.refreshUserCtx().then(() => true);
        }
      })
      .catch((response) => {
        if (response.status === 401) {
          // connected to the internet but no session on the server
          this.navigateToLogin();
        }
      });
  }

  // TODO Use a shared library for this duplicated code #4021
  hasRole(userCtx, role) {
    return !!(userCtx && userCtx.roles && userCtx.roles.includes(role));
  }

  /**
   * Returns true if the logged in user has the db or national admin role.
   * @param userCtx (optional) Will get the current userCtx if not provided.
   */
  isAdmin(userCtx?) {
    userCtx = userCtx || this.userCtx();
    return this.hasRole(userCtx, '_admin')
      || this.hasRole(userCtx, 'national_admin'); // deprecated: kept for backwards compatibility: #4525
  }

  // Returns true if the logged in user is a DB admin
  // @param {userCtx} (optional) Will get the current userCtx if not provided.
  isDbAdmin(userCtx) {
    userCtx = userCtx || this.userCtx();
    return this.hasRole(userCtx, '_admin');
  }

  /**
   * Returns true if the logged in user is online only
   */
  isOnlineOnly(userCtx?): boolean {
    userCtx = userCtx || this.userCtx();
    return this.isAdmin(userCtx) || this.hasRole(userCtx, SESSION.ONLINE_ROLE);
  }
}
