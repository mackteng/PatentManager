angular
  .module('patentApp')
  .config(['$stateProvider', '$urlRouterProvider', routeConfig]);

function routeConfig($stateProvider, $urlRouterProvider){

    $stateProvider
      .state('overview',{
        url:'/overview',
        templateUrl: 'js/overview/overview.html',
        controller: 'overviewController',
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

allClients.$inject=['clientService'];
function allClients(clientService){
  return clientService.listAllClients();
}
