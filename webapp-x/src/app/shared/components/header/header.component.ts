import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @Input() adminUrl;
  @Input() canLogOut;
  @Input() tours;
  showPrivacyPolicy =  false;
  replicationStatus;
  currentTab = 'tasks';
  unreadCount = {};
  permittedTabs = [
    {
      name: 'messages',
      state: 'messages.detail',
      defaultIcon: 'fa-envelope',
      translation: 'Messages',
      permissions: ['can_view_messages', 'can_view_messages_tab'],
      typeName: 'message'
    },
    {
      name: 'tasks',
      state: 'tasks.detail',
      defaultIcon: 'fa-flag',
      translation: 'Tasks',
      permissions: ['can_view_tasks','can_view_tasks_tab'],
    },
    {
      name: 'reports',
      state: 'reports.detail',
      defaultIcon: 'fa-list-alt',
      translation: 'Reports',
      permissions: ['can_view_reports','can_view_reports_tab'],
      typeName: 'report',
    },
    {
      name:'contacts',
      state:'contacts.detail',
      defaultIcon:'fa-user',
      translation:'Contacts',
      permissions: ['can_view_contacts','can_view_contacts_tab'],
    },
    {
      name: 'analytics',
      state: 'analytics',
      defaultIcon: 'fa-bar-chart-o',
      translation: 'Analytics',
      permissions: ['can_view_analytics','can_view_analytics_tab'],
    }
  ];

  constructor() { }

  ngOnInit(): void {

  }

  openGuidedSetup() {

  }

  openTourSelect() {

  }

  openFeedback() {

  }

  logout() {

  }

  replicate() {

  }
}
