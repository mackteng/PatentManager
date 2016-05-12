angular
  .module('patentApp')
  .factory('patentService', ['$http', patentService]);

function patentService($http){

  var baseUrl = 'http://192.168.19.156/api/';
  var patentService = {};

  patentService.listAllPatents = function(){
    return $http.get(baseUrl + 'patents/');
  }

  return patentService;
}
