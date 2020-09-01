import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ResourceIcons } from '../services/resource-icons.service';

@Pipe({
  name: 'headerLogo'
})
export class HeaderLogoPipe implements PipeTransform {
  constructor(
    private resourceIcons: ResourceIcons,
    private sanitizer: DomSanitizer
  ) { }

  transform(name: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.resourceIcons.getImg(name, 'branding'));
  }
}

@Pipe({
  name: 'resourceIcon'
})
export class ResourceIconPipe implements PipeTransform {
  constructor(
    private resourceIcons: ResourceIcons,
    private sanitizer: DomSanitizer,
  ) { }

  transform(name:string, placeholder = '') {
    return this.sanitizer.bypassSecurityTrustHtml(this.resourceIcons.getImg(name, 'resources', placeholder));
  }
}

@Pipe({
  name: 'partnerImage'
})
export class PartnerImagePipe implements PipeTransform {
  constructor(
    private resourceIcons: ResourceIcons,
    private sanitizer: DomSanitizer,
  ) { }

  transform(name:string) {
    return this.sanitizer.bypassSecurityTrustHtml(this.resourceIcons.getImg(name, 'partners'));
  }
}


/*
angular.module('inboxFilters').filter('resourceIcon',
  function (
    $sce,
    ResourceIcons
  ) {
    'use strict';
    'ngInject';
    return (name, placeholder = '') => {
      return $sce.trustAsHtml(ResourceIcons.getImg(name, 'resources', placeholder));
    };
  }
);

angular.module('inboxFilters').filter('headerLogo',
  function(
    $sce,
    ResourceIcons
  ) {
    'use strict';
    'ngInject';
    return function(name) {
      return $sce.trustAsHtml(ResourceIcons.getImg(name, 'branding'));
    };
  }
);

angular.module('inboxFilters').filter('partnerImage',
  function(
    $sce,
    ResourceIcons
  ) {
    'use strict';
    'ngInject';
    return name => {
      return $sce.trustAsHtml(ResourceIcons.getImg(name, 'partners'));
    };
  }
);
*/
