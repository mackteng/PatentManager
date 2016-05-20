angular
  .module('patentApp')
  .config(['$stateProvider', '$urlRouterProvider', routeConfig]);

function routeConfig($stateProvider, $urlRouterProvider){

    //$urlRouterProvider.otherwise('/manage');
    $stateProvider
      .state('overview',{
        url:'/overview',
        templateUrl: 'templates/overview.html'
      })
      .state('manage',{
        url:'/manage',
        templateUrl: 'templates/patentManager.html',
        controller: 'patentController',
        controllerAs: 'vm',
        resolve:{
          allPatents : allPatents,
          allClients : allClients
        }
      });
}

allPatents.$inject=['patentService'];
function allPatents(patentService){
  return patentService.listAllPatents();
}

allClients.$inject=['clientService'];
function allClients(clientService){
  return clientService.listAllClients();
}
