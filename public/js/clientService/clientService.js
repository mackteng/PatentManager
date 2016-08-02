angular
  .module('patentApp')
  .factory('clientService', ['$http', 'config', 'authentication', clientService]);

  function clientService($http, config, authentication){
    var baseUrl = config.baseUrl;
    var clientService = {};
    clientService.listAllClients = function(){
      return $http.get(baseUrl + 'clients/', {
        headers:{
            Authorization: 'Bearer ' + authentication.getToken()
        }
      });
    };
    return clientService;
  }
