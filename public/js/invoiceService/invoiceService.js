angular
  .module('patentApp')
  .factory('invoiceService', ['$http', 'config', 'authentication', invoiceService]);

function invoiceService($http, config, authentication){

  var baseUrl = config.baseUrl;

  var invoiceService = {};

  invoiceService.listAllInvoices = function(){
    return $http.get(baseUrl + '/invoices', {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  };

  invoiceService.deleteInvoice = function(invoiceId){
    return $http.delete(baseUrl + '/invoices/' + invoiceId, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }

  invoiceService.populateInvoice = function(invoiceId){
    return $http.get(baseUrl + '/invoices/' + invoiceId, {complete : true}, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }


  return invoiceService;
}
