const moment = require('moment');

/**
 * Wrapper function for moment.localeData() so it can be mocked
 */
(function () {

  'use strict';

  angular.module('services').factory('MomentLocaleData',
    function() {
      return moment.localeData;
    }
  );

}());
