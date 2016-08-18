angular
  .module('patentApp')
  .config(['$stateProvider', '$urlRouterProvider', routeConfig]);

function routeConfig($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('manage');
    $stateProvider
      .state('overview',{
        url:'/overview',
        templateUrl: 'js/patentCalendar/calendar.html',
        controller: 'calendarController',
        controllerAs: 'vm',
        resolve:{
          allEvents  : allEvents
        }
      })
      .state('manage',{
        url:'/manage',
        templateUrl: 'js/patentManager/patentManager.html',
        controller: 'patentController',
        controllerAs: 'vm',
        resolve:{
          allPatents : allPatents,
          allClients : allClients
        }
      })
      .state('manage.details', {
        url:'/:id',
        templateUrl: 'js/patentManager/patentDetails.html',
        controller: 'patentDetailsController',
        controllerAs: 'vm',
        resolve:{
          eventHistory : getEventHistory,
          patent : allPatentsChild
        }
      })
      .state('clients',{
          url:'/clients',
          templateUrl: 'js/patentClient/patentClient.html',
          controller: 'patentClientController',
          controllerAs: 'vm',
          resolve:{
            allClients : allClients
          }
      })
      .state('clients.details',{
          url:'/:clientid',
          templateUrl: 'js/patentClient/clientDetails.html',
          controller: 'clientDetailsController',
          controllerAs: 'vm',
          resolve:{
            client : allClientsChild
          }
      })
      .state('emailTemplates', {
        url:'/emailTemplates',
        templateUrl: 'js/patentEmailTemplate/patentEmailTemplate.html',
        controller: 'patentEmailTemplateController',
        controllerAs: 'vm',
        resolve:{
          emailTemplates : emailTemplates
        }
      })
      .state('invoiceTemplates', {
        url:'/invoiceTemplates',
        templateUrl: 'js/patentInvoiceTemplate/patentInvoiceTemplate.html',
        controller: 'patentInvoiceTemplateController',
        controllerAs: 'vm',
        resolve:{
          invoices: allInvoices
        }
      })
      .state('login', {
          url: '/login',
          templateUrl: 'js/auth/login/login.html',
          controller: 'loginController',
          controllerAs: 'vm'
      });
}

angular
  .module('patentApp')
  .run(['$rootScope', '$state', '$location', 'authentication', function($rootScope, $state, $location, authentication){
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState){
          if(toState.name != 'login' && !authentication.isLoggedIn()){
              $state.go('login');
              event.preventDefault();
              return;
          }
      });
  }]);

emailTemplates.$inject=['emailTemplateService'];
function emailTemplates(emailTemplateService){
  return emailTemplateService.listAllEmailTemplates();
}

allInvoices.$inject=['invoiceService'];
function allInvoices(invoiceService){
  return invoiceService.listAllInvoices();
}

allEvents.$inject=['eventService'];
function allEvents(eventService){
  return eventService.listAllEvents();
}

getEventHistory.$inject = ['eventService', '$stateParams'];
function getEventHistory(eventService, $stateParams){
  return eventService.getEventHistory($stateParams.id);
}

allPatentsChild.$inject=['allPatents'];
function allPatentsChild(allPatents){
  return {
    allPatents : allPatents.data
  }
}

allPatents.$inject=['patentService'];
function allPatents(patentService){
  return patentService.listAllPatents();
}

allClientsChild.$inject = ['allClients'];
function allClientsChild(allClients){
  return{
    allClients : allClients.data
  }
}

allClients.$inject=['clientService'];
function allClients(clientService){
  return clientService.listAllClients();
}
