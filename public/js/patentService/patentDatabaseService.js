angular
  .module('patentApp')
  .factory('patentService', ['$http', 'config', patentService]);

function patentService($http, config){
  var baseUrl = config.baseUrl;
  var patentService = {};
  patentService.listAllPatents = function(){
    return $http.get(baseUrl + 'patents/');
  }
  patentService.addNewPatent = function(patent){
    return $http.post(baseUrl + 'patents/', patent);
  }
  patentService.updatePatent = function(patent, patentid){
    return $http.put(baseUrl + 'patents/' + patentid , patent);
  }
  return patentService;
}
