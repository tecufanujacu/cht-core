angular.module('filters').filter('resourceIcon',
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

angular.module('filters').filter('headerLogo',
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

angular.module('filters').filter('partnerImage',
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
