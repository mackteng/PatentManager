angular
  .module('patentApp')
  .factory('patentService', ['$http', 'config', patentService]);

function patentService($http, config){
  var patents = null;
  var baseUrl = config.baseUrl;
  var patentService = {};
  var updating = false;

  patentService.listAllPatents = function(){
    //return $http.get(baseUrl + 'patents/');
    if(updating || patents == null){
      return patentService.getAllPatents();
    } else {
      return patents;
    }
  }
  patentService.getAllPatents = function(){
    return $http
      .get(baseUrl + 'patents/')
      .then(function(allPatents){
          patents = allPatents;
          return allPatents;
      }, function(err){
          console.log(err);
      });
  }
  patentService.addNewPatent = function(patent){
    return $http.post(baseUrl + 'patents/', patent);
  }
  patentService.updatePatent = function(patent, patentid){
    return $http.put(baseUrl + 'patents/' + patentid , patent);
  }
  patentService.deletePatent = function(patent, patentid){
    return $http.delete(baseUrl + 'patents/' + patentid);
  }
  patentService.getAllPatents();
  return patentService;
}
