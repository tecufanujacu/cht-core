const calendarInterval = require('@medic/calendar-interval');

(function () {

  'use strict';

  angular.module('services').factory('CalendarInterval', function() {
    return {
      getCurrent: calendarInterval.getCurrent,
    };
  });
}());
