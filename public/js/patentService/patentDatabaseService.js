angular
  .module('patentApp')
  .factory('patentService', ['$http', 'config', 'authentication', patentService]);

function patentService($http, config, authentication){
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
      .get(baseUrl + 'patents/', {
        headers:{
            Authorization: 'Bearer ' + authentication.getToken()
        }
      })
      .then(function(allPatents){
          patents = allPatents;
          return allPatents;
      }, function(err){
          console.log(err);
      });
  }
  patentService.addNewPatent = function(patent){
    return $http.post(baseUrl + 'patents/', patent, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }
  patentService.updatePatent = function(patent, patentid){
    return $http.put(baseUrl + 'patents/' + patentid , patent, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }
  patentService.deletePatent = function(patent, patentid){
    return $http.delete(baseUrl + 'patents/' + patentid, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }

  patentService.markUpdated = function(){
    updating = true;
  }
  patentService.getAllPatents();
  return patentService;
}
