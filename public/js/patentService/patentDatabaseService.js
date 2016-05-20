angular
  .module('patentApp')
  .factory('patentService', ['$http', patentService]);

function patentService($http){

  var baseUrl = 'http://192.168.19.157/api/';
  var patentService = {};

  patentService.listAllPatents = function(){
    return $http.get(baseUrl + 'patents/');
  }

  patentService.addNewPatent = function(patent){
    return $http.post(baseUrl + 'patents/', patent);
  }

  return patentService;
}
