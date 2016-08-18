angular
  .module('patentApp')
  .factory('emailTemplateService', ['$http', 'config', 'authentication', emailTemplateService]);

function emailTemplateService($http, config, authentication){

  var baseUrl = config.baseUrl;

  var emailTemplateService = {};

  emailTemplateService.listAllEmailTemplates = function(){
    return $http.get(baseUrl + '/emailTemplates', {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  };

  emailTemplateService.addEmailTemplate = function(template){
    return $http.post(baseUrl + '/emailTemplates', template, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  };

  emailTemplateService.deleteEmailTemplate = function(emailTemplateId){
    return $http.delete(baseUrl + '/emailTemplates/' + emailTemplateId, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }

  return emailTemplateService;
}
