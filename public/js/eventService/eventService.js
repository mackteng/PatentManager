angular
  .module('patentApp')
  .factory('eventService', ['$http', 'config', 'authentication', eventService]);

function eventService($http, config, authentication){

  var baseUrl = config.baseUrl;

  var eventService = {};

  eventService.listAllEvents = function(){
    return $http.get(baseUrl + '/events', {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  };

  eventService.getEventHistory = function(patentId){
    return $http.get(baseUrl + '/patents/' + patentId + '/events', {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  };

  eventService.addEvent = function(patentId, event){
    return $http.post(baseUrl + '/patents/' + patentId + '/events', event, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }

  eventService.updateEvent = function(eventId, event){
    return $http.put(baseUrl + '/events/' + eventId, event, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }

  eventService.deleteEvent = function(eventId){
    return $http.delete(baseUrl + '/events/' + eventId, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }
  return eventService;
}
