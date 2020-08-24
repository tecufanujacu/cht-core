import { Component } from '@angular/core';

import * as _ from 'lodash/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  currentTab = '';
  showContent = false;
  privacyPolicyAccepted = true;
  showPrivacyPolicy = false;
  selectMode = false;
  minimalTabs = false;
  adminUrl;
  canLogOut;
  tours;

  constructor () {
    _.templateSettings.interpolate = /\{\{(.+?)\}\}/g;
    _.partial.placeholder = _;
  }
}
