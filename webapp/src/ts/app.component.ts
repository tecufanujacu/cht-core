import { Component } from '@angular/core';

import * as _ from 'lodash/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  currentTab = '';
  showContent = false;
  privacyPolicyAccepted = true;
  selectMode = false;
  minimalTabs = true;
  adminUrl;
  canLogOut;
  tours;

  constructor () {
    _.templateSettings.interpolate = /\{\{(.+?)\}\}/g;
    _.partial.placeholder = _;
  }
}
