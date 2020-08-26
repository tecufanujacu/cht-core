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
    const image = this.resourceIcons.getImg(name, 'branding') || '';

    return this.sanitizer.bypassSecurityTrustHtml(image);
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
