angular.module('patentApp',['ui.bootstrap', 'ui.router', 'ngCookies', 'ui.calendar','angularjs-dropdown-multiselect', 'ui.grid','ui.grid.pagination','ui.grid.resizeColumns','ngFileUpload']);
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
;angular.module('patentApp').constant('config', {
    baseUrl : 'api/'
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

  eventService.completeEvent = function(eventId){
    return $http.put(baseUrl + '/events/' + eventId, {complete : true}, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }

  eventService.deleteEvent = function(eventId){
    return $http.delete(baseUrl + '/events/' + eventId, {
      headers:{
          Authorization: 'Bearer ' + authentication.getToken()
      }
    });
  }
  return eventService;
}
;angular
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
;angular
  .module('patentApp')
  .controller('calendarController', calendarController);

calendarController.$inject=['allEvents'];

function calendarController(allEvents){
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
            url   : '#/manage/' + vm.events[i].patentID
        }
      );
    }
  }
}
;angular
  .module('patentApp')
  .controller('clientDetailsController', clientDetailsController);

  clientDetailsController.$inject=['$stateParams', 'client', 'clientService'];

  function clientDetailsController($stateParams, client, clientService){
    var vm = this;
    vm.clients = client.allClients;
    for(var i = 0; i < vm.clients.length; i++){
      if(vm.clients[i]._id === $stateParams.clientid){
        vm.client = vm.clients[i];
        break;
      }
    }
    // contacts
    vm.addContact = function(){
      if(vm.editEnabled)vm.client.contacts.push({});
    }
    vm.deleteContact = function($index){
      if(vm.editEnabled)vm.client.contacts.splice($index, 1);
    }
    //edit
    vm.editEnabled = false;
    vm.oldClient = null;
    vm.enableEdit = function(){
      vm.oldClient = angular.copy(vm.client);
      vm.editEnabled = true;
    }

    vm.cancelEdit = function(){
      angular.copy(vm.oldPatent, vm.patent);
      vm.editEnabled = false;
    }

    vm.save = function(){
      clientService
        .updateClient(vm.client, vm.client._id)
        .success(function(){
          angular.copy(vm.client, vm.oldClient);
          vm.editEnabled = false;
        })
        .error(function(err){
          alert(err);
          vm.cancelEdit();
        });
    }
  }
;angular.module('patentApp').controller('newClientFormController', newClientFormController);
newClientFormController.$inject=['$uibModalInstance', 'clientService'];
function newClientFormController($uibModalInstance, clientService){
  var vm = this;
  vm.client={};
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


  // Contacts
  vm.client.contacts = [];
  vm.addContact = function(){
    vm.client.contacts.push({});
  };
  vm.deleteContact = function($index){
    vm.client.contacts.splice($index, 1);
  };

  // Submit patent application
  vm.submit = function(){
    console.log(vm.client);
    clientService
      .addNewClient(vm.client)
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
  .controller('patentClientController', patentClientController);

  patentClientController.$inject=['allClients', '$uibModal'];

  function patentClientController(allClients, $uibModal){
    var vm = this;
    vm.clients = allClients.data;

    // new patent form variable and functions
    vm.newClientForm = function(){
      var modalInstance = $uibModal.open({
        templateUrl: 'js/patentClient/newClientForm.html',
        size: 'med',
        backdrop : 'static',
        controller: 'newClientFormController',
        controllerAs: 'vm',
        resolve:{
            allClients : function(){
              return vm.clients
            }
        }
      });
    }
  }
;angular
  .module('patentApp')
  .controller('patentEmailTemplateController', patentEmailTemplateController);

  patentEmailTemplateController.$inject=['$sce']

  function patentEmailTemplateController($sce){
    var vm = this;
    vm.testEvent = {
      "status": "Active",
      "patentExpirationDate": "",
      "patentType": "Patent",
      "filingDate": "2015-05-13T00:00:00",
      "filingNumber": "104115268",
      "country": "TW",
      "issueNumber": "",
      "clientId": "6101",
      "chineseTitle": "電磁元件及其線圈結構",
      "docketNumber": 105,
      "clientDocketNumber": "RD-101007-TW-1-D1",
      "publicationDate": "",
      "Comment": "",
      "applicationType": "REG"
    };
    vm.gmailURL = $sce.trustAsResourceUrl("http://mail.google.com/mail/?compose=1&view=cm&fs=1");
    vm.populatedBody = 'hello';


  }
;angular
  .module('patentApp')
  .controller('patentInvoiceTemplateController', patentInvoiceTemplateController);
  patentInvoiceTemplateController.$inject=['Upload', 'invoices'];

  function patentInvoiceTemplateController(Upload, invoices){
    var vm = this;
    vm.invoices = invoices.data;
    vm.testEvent = {
      "status": "Active",
      "patentExpirationDate": "",
      "patentType": "Patent",
      "filingDate": "2015-05-13T00:00:00",
      "filingNumber": "104115268",
      "country": "TW",
      "issueNumber": "",
      "clientId": "6101",
      "chineseTitle": "電磁元件及其線圈結構",
      "docketNumber": 105,
      "clientDocketNumber": "RD-101007-TW-1-D1",
      "publicationDate": "",
      "Comment": "",
      "applicationType": "REG"
    };

    vm.uploadFile = function(file){
      vm.f = file;
      if(file){
          file.upload = Upload.upload({
            url: 'api/invoices',
            data: {file: file}
          })
          file.upload.then(function (response) {
                vm.invoices.push(file.name);
            }, function (response) {
                if (response.status > 0)
                    vm.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
      }
    };

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
  vm.dateOptions = {};
  vm.openDatePicker1 = function(){
    vm.picker1 = true;
  }


  // application Types
  vm.applicationTypes = ['REG', 'DIV', 'CA', 'CIP', 'PRO'];

  // enable Priority Form
  vm.picker = {};
  vm.patent.priority = [];
  vm.addPriority = function(){
    vm.patent.priority.push({});
  }
  vm.openDatePicker = function($index){
    vm.picker[$index] = true;
  }
  vm.deletePriority = function($index){
    vm.patent.priority.splice($index, 1);
  };


  // status
  vm.patent.status = 'Active';
  vm.statusIs = function(status){
    return (status === vm.patent.status);
  }

  vm.changeStatus = function(status){
    vm.patent.status = status;
    if(!vm.statusIs('Allowed')){
      vm.patent.issueNumber='';
      vm.patent.patentExpirationDate='';
    }
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
  vm.listCountries = ['US', 'TW', 'CN', 'JP', 'KR', 'EP'];

  // Submit patent application
  vm.submit = function(){
    console.log(vm.patent);
    vm.patent.patentType = 'Patent';
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
    if(vm.patents[i]._id === $stateParams.id){
      vm.patent = vm.patents[i];
      break;
    }
  }
  // format date
  vm.patent.filingDate = new Date(vm.patent.filingDate);
  if(vm.patent.publicationDate) vm.patent.publicationDate = new Date(vm.patent.publicationDate);
  if(vm.patent.patentExpirationDate) vm.patent.patentExpirationDate = new Date(vm.patent.patentExpirationDate);
  for(i = 0; i < vm.patent.priority.length; i++){
    vm.patent.priority[i].priorityDate = new Date(vm.patent.priority[i].priorityDate);
  }
  for(i = 0; i < vm.eventHistory.length; i++){
    vm.eventHistory[i].eventDeadline = new Date(vm.eventHistory[i].eventDeadline);
  }


  //list of countries
  vm.listCountries = ['US', 'TW', 'CN', 'JP', 'KR', 'EP'];
  // application Types
  vm.applicationTypes = ['REG', 'DIV', 'CA', 'CIP', 'PRO'];
  // date pickers
  vm.dateOptions = {};

  vm.openDatePicker = function(item){
    vm.picker={};
    vm.picker[item] = true;
  }

  // Inventors
  vm.addInventor = function(){
    if(vm.editEnabled) vm.patent.inventors.push({});
  };
  vm.deleteInventor = function($index){
    if(vm.editEnabled)vm.patent.inventors.splice($index, 1);
  };



  // Priority Form
  vm.priorityDatePicker={};
  vm.addPriority = function(){
    if(vm.editEnabled)vm.patent.priority.push({});
  }
  vm.openPriorityDatePicker = function($index){
    vm.priorityDatePicker[$index] = true;
  }
  vm.deletePriority = function($index){
    if(vm.editEnabled)vm.patent.priority.splice($index, 1);
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

  // events
  vm.newEvent = {
    notificationEmails:[],
    notificationDates:[]
  };
  vm.completeEvent = function($index){
    eventService
      .completeEvent(vm.eventHistory[$index]._id)
      .success(function(){
        vm.eventHistory[$index].completed = true;
      })
      .error(function(err){
        console.log(err);
      })
  }
  vm.deleteEvent = function($index){
    eventService
      .deleteEvent(vm.eventHistory[$index]._id)
      .success(function(){
        vm.eventHistory.splice($index,1);
      })
      .error(function(err){
        console.log(err);
      })
  }
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
    if(!vm.newEvent.eventName){
      alert('Must provide name of event');
      return;
    }

    if(!vm.newEvent.eventDeadline){
      alert('Must specify deadline');
      return;
    }
    vm.newComment = vm.newEvent.eventName;
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
        vm.addComment();
        vm.newEvent = {
          notificationEmails:[],
          notificationDates:[]
        };

        //patentService.markUpdated();
      })
      .error(function(){
        alert('Error adding event');
      });
  };

  vm.addComment = function(){
    vm.patent.comments.unshift(vm.newComment);
    vm.newComment = "";
    vm.save();
  }

  vm.statusIs = function(status){
    return (status === vm.patent.status);
  }

  vm.changeStatus = function(status){
    if(vm.editEnabled) vm.patent.status = status;
    if(!vm.statusIs('Allowed')){
      delete vm.patent.issueNumber;
      delete vm.patent.patentExpirationDate;
    }
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

  function pad(str){
    while(str.length < 3) str = '0' + str;
    return str;
  }

  vm.gridOptions = {
    enableFiltering: true,
    data: vm.patents,
    enablePaginationControls: true,
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    rowHeight:50,
    columnDefs:[
      {field: 'litronDocketNumber', displayName: 'Docket Number', cellTemplate:'<div class="ui-grid-cell-contents">' + '<a href="#/manage/' + '{{row.entity._id}}' + '">' + '{{row.entity.litronDocketNumber}}' + "</a>"},
      {field: 'clientDocketNumber', displayName: 'Client Docket Number'},
      {field: 'applicationType', displayName: 'Application Type'},
      {field: 'filingDate', displayName: 'Filing Date', cellFilter: 'date'},
      {field: 'englishTitle', displayName: 'English Title'},
      {field: 'chineseTitle', displayName: 'Chinese Title'},
      {field: 'comments[0]', displayName: 'LastActivity'},
      {field: 'status', displayName: 'Status'}
    ]
  };


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
        controllerAs: 'vm'
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
