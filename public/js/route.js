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
        templateUrl: 'templates/patentDatabase.html',
        controller: 'patentController',
        controllerAs: 'vm',
        resolve:{
          allPatents : allPatents
        }
      });
}

allPatents.$inject=['patentService'];
function allPatents(patentService){
  return patentService.listAllPatents();
}
