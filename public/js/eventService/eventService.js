angular
  .module('patentApp')
  .factory('eventService', ['$http', 'config', eventService]);

function eventService($http, config){

  var baseUrl = config.baseUrl;

  var eventService = {};

  eventService.getEventHistory = function(patentId){
    return $http.get(baseUrl + '/patents/' + patentId + '/events');
  };

  eventService.addEvent = function(patentId, event){
    return $http.post(baseUrl + '/patents/' + patentId + '/events', event);
  }
  return eventService;
}
