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
    clientService.addNewClient = function(client){
      return $http.post(baseUrl + 'clients/', client,{
        headers:{
          Authorization: 'Bearer ' + authentication.getToken()
        }
      });
    }
    clientService.updateClient = function(client){
      return $http.put(baseUrl + 'clients/'+client._id, client,{
        headers:{
          Authorization: 'Bearer ' + authentication.getToken()
        }
      });
    }
    return clientService;
  }
