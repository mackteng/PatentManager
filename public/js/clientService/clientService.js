angular
  .module('patentApp')
  .factory('clientService', ['$http', 'config', clientService]);

  function clientService($http, config){
    var baseUrl = config.baseUrl;
    var clientService = {};
    clientService.listAllClients = function(){
      return $http.get(baseUrl + 'clients/');
    };
    return clientService;
  }
