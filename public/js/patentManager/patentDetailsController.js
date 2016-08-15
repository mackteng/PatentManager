angular
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
  vm.patent.publicationDate = new Date(vm.patent.publicationDate);
  vm.patent.patentExpirationDate = new Date(vm.patent.patentExpirationDate);
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
