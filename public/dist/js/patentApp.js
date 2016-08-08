angular.module('patentApp',['ui.bootstrap', 'ui.router', 'ngCookies', 'ui.calendar','angularjs-dropdown-multiselect']);
;angular
  .module('patentApp')
  .factory('authentication', ['$window', 'config', '$http', authentication]);

  //authentication.$inject=['$window', 'config', '$http'];

  function authentication($window, config, $http){
    var baseUrl = config.baseUrl;
    var saveToken = function(token){
        $window.localStorage["token"] = token;
    }
    var getToken = function(token){
      return $window.localStorage["token"];
    }
    var register = function(user){
      return $http.post(baseUrl + 'register/', user).success(function(data){
          saveToken(data);
      });
    }

    var login = function(user){
      return $http.post(baseUrl + 'login/', user).success(function(data){
          saveToken(data);
      });
    }

    var logout = function() {
      $window.localStorage.removeItem('loc8r-token');
    };

    var isLoggedIn = function(){
      var token = getToken();
      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    }

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return {
          email : payload.email,
          name : payload.name
        };
      }
    };

    return {
      saveToken : saveToken,
      getToken : getToken,
      register: register,
      login : login,
      logout : logout,
      isLoggedIn : isLoggedIn,
      currentUser : currentUser
    };
  };
;angular
  .module('patentApp')
  .controller('loginController', ['authentication', '$state', loginController]);

  function loginController(authentication, $state){
    var vm = this;
    vm.error = '';

    vm.login = function(){
      if(!vm.email || !vm.password){
          alert('Both fields must be filled in');
      } else {
          authentication.login({
              email: vm.email,
              password: vm.password
          }).error(function(err){
            vm.error = err.message;
            vm.email = '';
            vm.password = '';
          }).then(function(){
            $state.go('overview');
          });
      }
    }
  };
;angular
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
;angular.module('patentApp').constant('config', {
    baseUrl : 'http://192.168.19.157/api/'
});
;angular
  .module('patentApp')
  .factory('eventService', ['$http', 'config', 'authentication', eventService]);

function eventService($http, config, authentication){

  var baseUrl = config.baseUrl;

  var eventService = {};

  eventService.listAllEvents = function(){
    return $http.get(baseUrl + '/events', {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  };

  eventService.getEventHistory = function(patentId){
    return $http.get(baseUrl + '/patents/' + patentId + '/events', {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  };

  eventService.addEvent = function(patentId, event){
    return $http.post(baseUrl + '/patents/' + patentId + '/events', event, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }
  return eventService;
}
;angular
  .module('patentApp')
  .controller('overviewController', overviewController);

overviewController.$inject=['allEvents'];

function overviewController(allEvents){
  var vm = this;
  vm.events = allEvents.data;
  vm.eventSources = {events:[]}
  vm.config = {
    calendar:{
      height:800,
      header:{
          left: 'month basicWeek basicDay',
          center: 'title',
          right: 'today prev,next'
        }
    }
  }

  // populate events
  for(var i = 0; i < vm.events.length; i++){
    if(vm.events[i].completed == false){
      vm.eventSources.events.push(
        {
            title : vm.events[i].eventName,
            start : new Date(vm.events[i].eventDeadline),
            url   : 'starter.html#/manage/' + vm.events[i].patentID
        }
      );
    }
  }
}
;angular.module('patentApp').controller('newPatentFormController', newPatentFormController);
newPatentFormController.$inject=['$uibModalInstance', 'allClients', 'patentService'];
function newPatentFormController($uibModalInstance,  allClients, patentService){
  var vm = this;

  // patent application
  vm.patent = {};
  vm.clients = allClients;
  // message alert
  vm.message = {
    type: 'success',
    content: null
  }
  vm.closeMessage = function(){
    vm.message.content = null;
  }
  vm.setMessage = function(type,message){
    vm.message.type = type;
    vm.message.content = message;
  }

  // active on by default
  vm.patent.active = true;

  // date picker
  vm.picker1 = false;
  vm.picker2 = false;
  vm.dateOptions = {};
  vm.openDatePicker1 = function(){
    vm.picker1 = true;
  }
  vm.openDatePicker2 = function(){
    vm.picker2 = true;
  }

  // application Types
  vm.applicationTypes = ['Patent'];

  // enable Priority Form
  vm.enablePriorityForm = false;
  vm.clearPriority = function(){
    delete vm.patent.priority;
  }

  // Inventors
  vm.patent.inventors = [];
  vm.addInventor = function(){
    vm.patent.inventors.push({});
  };
  vm.deleteInventor = function($index){
    vm.patent.inventors.splice($index, 1);
  };

  // List of countries
  vm.listCountries = ['US', 'TW', 'CN', 'JP', 'KR', 'EU'];

  // Submit patent application
  vm.submit = function(){
    patentService
      .addNewPatent(vm.patent)
      .success(function(data){
        $uibModalInstance.close(data);
      })
      .error(function(err){
        vm.setMessage('danger', 'ERROR  : ' + err.message);
      });
  };

  // cancel
  vm.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };
}
;angular
  .module('patentApp')
  .controller('patentDetailsController', patentDetailsController);

patentDetailsController.$inject = ['$scope','$stateParams', 'patent', 'eventHistory', 'eventService', 'patentService'];

function patentDetailsController($scope, $stateParams, patent, eventHistory, eventService, patentService){
  var vm = this;
  vm.patents = patent.allPatents;
  vm.patent = null;
  vm.eventHistory = eventHistory.data;

  for(var i = 0; i < vm.patents.length; i++){
    if(vm.patents[i]._id == $stateParams.id){
      vm.patent = vm.patents[i];
      break;
    }
  }

  // format date
  vm.patent.filingDate = new Date(vm.patent.filingDate);
  if(vm.patent.priority){
    vm.patent.priority.priorityDate = new Date(vm.patent.priority.priorityDate);
  }

  for(i = 0; i < vm.eventHistory.length; i++){
    vm.eventHistory[i].eventDeadline = new Date(vm.eventHistory[i].eventDeadline);
  }


  vm.enablePriorityForm = vm.patent.priority!=null;
  //list of countries
  vm.listCountries = ['US', 'TW', 'CN', 'JP', 'KR', 'EU'];
  // application Types
  vm.applicationTypes = ['Patent'];
  // date picker
  vm.picker1 = false;
  vm.picker2 = false;
  vm.picker3 = false;
  vm.dateOptions = {};
  vm.openDatePicker1 = function(){
    vm.picker1 = true;
  }
  vm.openDatePicker2 = function(){
    vm.picker2 = true;
  }
  vm.openDatePicker3 = function(){
    vm.picker3 = true;
  }
  // Inventors
  vm.addInventor = function(){
    if(vm.editEnabled) vm.patent.inventors.push({});
  };
  vm.deleteInventor = function($index){
    vm.patent.inventors.splice($index, 1);
  };


  // Timeline options
  vm.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };

  // Edit option
  vm.editEnabled = false;
  vm.oldPatent = null;
  vm.enableEdit = function(){
    vm.oldPatent = angular.copy(vm.patent);
    vm.editEnabled = true;
  }

  vm.cancelEdit = function(){
    angular.copy(vm.oldPatent, vm.patent);
    vm.editEnabled = false;
  }

  vm.save = function(){
    patentService
      .updatePatent(vm.patent, vm.patent._id)
      .success(function(){
        angular.copy(vm.patent, vm.oldPatent);
        vm.editEnabled = false;
      })
      .error(function(err){
        alert(err);
      });
  }

  vm.delete = function(){
    patentService
      .deletePatent(vm.patent._id)
      .success(function(){
        alert('deleted');
      })
      .error(function(err){
          console.log(err);
      });
  }

  vm.newEvent = {
    notificationEmails:[],
    notificationDates:[]
  };
  vm.emailsList = [
    {
      id:1,
      label: 'janiceshih@litron-intl.com'
    },
    {
      id:2,
      label: 'mackteng@litron-intl.com'
    },
    {
      id:3,
      label: 'miketeng@litron-intl.com'
    },
    {
      id:4,
      label: 'wilasato@litron-intl.com'
    }
  ];
  vm.multiSettings = {displayProp: 'label', idProp: 'label'};
  vm.multiSettingsDate = {displayProp: 'label', idProp: 'date'};

  vm.addEvent = function(){
    console.log(vm.newEvent);
    if(!vm.newEvent.eventName){
      alert('Must provide name of event');
      return;
    }

    if(!vm.newEvent.eventDeadline){
      alert('Must specify deadline');
      return;
    }

    vm.newEvent.eventName = vm.patent.clientId + '.' + vm.patent.docketNumber + '.' +vm.patent.country.toUpperCase() + ' ' + vm.newEvent.eventName;
    for(var i = 0; i < vm.newEvent.notificationEmails.length; i++){
      vm.newEvent.notificationEmails[i] = vm.newEvent.notificationEmails[i].id;
    }
    for(var i = 0; i < vm.newEvent.notificationDates.length; i++){
      vm.newEvent.notificationDates[i] = vm.newEvent.notificationDates[i].id;
    }
    eventService
      .addEvent(vm.patent._id, vm.newEvent)
      .success(function(){
        vm.eventHistory.unshift(vm.newEvent);
        vm.lastDeadline = vm.newEvent;
        vm.newEvent = {
          notificationEmails:[],
          notificationDates:[]
        };
        patentService.markUpdated();
      })
      .error(function(){
        alert('Error adding event');
      });
  };

  vm.addComment = function(){
    vm.patent.comments.push(vm.newComment);
    vm.newComment = "";
    vm.save();
  }

  vm.displayStatus = function(status){
    return !(status === vm.patent.status);
  }

  vm.changeStatus = function(status){
    if(vm.editEnabled) vm.patent.status = status;
  }

  $scope.$watch('vm.newEvent.eventDeadline', function(current, original){
    vm.datesList = [];
    var index = 0;

    // add 1-6 days before
    for(var i = 1; i <= 6; i++){
      var date = new Date(current);
      date.setDate(date.getDate()-i);
      vm.datesList.push({
        id: index++,
        label: i + ' day(s) before',
        date: date
      });
    };
    // add 1-8 weeks before
    for(var i = 1; i <= 8; i++){
      var date = new Date(current);
      date.setDate(date.getDate()-(i*7));
      vm.datesList.push({
        id: index++,
        label: i + ' week(s) before',
        date: date
      });
    };
  });
}
;angular.module('patentApp').controller('patentController', patentController);
patentController.$inject=['allPatents', 'allClients', '$uibModal', '$log'];
function patentController(allPatents, allClients, $uibModal){
  var vm = this;
  // patents
  vm.patents = allPatents.data;
  vm.clients = allClients.data;

  console.log(vm.patents);

  // advanced search collapse variable and functions
  vm.advancedSearchCollapse = true;
  vm.toggleAdvancedSearch = function(){
    vm.advancedSearchCollapse = !vm.advancedSearchCollapse;
  }

  // ordering properties
  vm.orderProperty='clientId';
  vm.reverse=false;
  vm.changeOrder = function(property){
      if(vm.orderProperty === property){
        vm.reverse = !vm.reverse;
      } else {
        vm.reverse = false;
        vm.orderProperty = property;
      }
  };

  // new patent form variable and functions
  vm.newPatentForm = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'js/patentManager/newPatentForm.html',
      size: 'med',
      backdrop : 'static',
      controller: 'newPatentFormController',
      controllerAs: 'vm',
      resolve:{
          allClients : function(){
            return vm.clients
          }
      }
    });

    modalInstance.result.then(function(patent){
      vm.patents.push(patent);
    });
  }
}
;angular
  .module('patentApp')
  .factory('patentService', ['$http', 'config', 'authentication', patentService]);

function patentService($http, config, authentication){
  var patents = null;
  var baseUrl = config.baseUrl;
  var patentService = {};
  var updating = false;

  patentService.listAllPatents = function(){
    //return $http.get(baseUrl + 'patents/');
    if(updating || patents == null){
      return patentService.getAllPatents();
    } else {
      return patents;
    }
  }
  patentService.getAllPatents = function(){
    return $http
      .get(baseUrl + 'patents/', {
        headers:{
            Authorization: 'Bearer ' + authentication.getToken()
        }
      })
      .then(function(allPatents){
          patents = allPatents;
          return allPatents;
      }, function(err){
          console.log(err);
      });
  }
  patentService.addNewPatent = function(patent){
    return $http.post(baseUrl + 'patents/', patent, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }
  patentService.updatePatent = function(patent, patentid){
    return $http.put(baseUrl + 'patents/' + patentid , patent, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }
  patentService.deletePatent = function(patent, patentid){
    return $http.delete(baseUrl + 'patents/' + patentid, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }

  patentService.markUpdated = function(){
    updating = true;
  }
  patentService.getAllPatents();
  return patentService;
}
;angular
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
