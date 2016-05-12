angular
  .module('patentApp')
  .config(['$stateProvider', '$urlRouterProvider', routeConfig]);

function routeConfig($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/manage');

    $stateProvider
      .state('overview',{
        url:'/overview',
        templateUrl: 'templates/overview.html'
      })
      .state('manage',{
        url:'/manage',
        templateUrl: 'templates/manage.html',
        controller: 'patentController',
        controllerAs: 'vm',
        resolve:{
          patentData : patentData
        }
      });
}

patentData.$inject=['patentService'];
function patentData(patentService){
  return patentService.listAllPatents();
}
