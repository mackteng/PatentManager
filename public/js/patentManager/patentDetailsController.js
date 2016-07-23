angular
  .module('patentApp')
  .controller('patentDetailsController', patentDetailsController);

patentDetailsController.$inject = ['$stateParams', 'patent', 'eventHistory', 'eventService', 'patentService'];

function patentDetailsController($stateParams, patent, eventHistory, eventService, patentService){
  var vm = this;
  vm.patents = patent.allPatents;
  vm.patent = null;
  vm.eventHistory = eventHistory.data.eventHistory;


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

  vm.newEvent = {};

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
    console.log(vm.patent);
    patentService
      .updatePatent(vm.patent, vm.patent._id)
      .success(function(){
        angular.copy(vm.patent, vm.oldPatent);
        vm.editEnabled = false;
      })
      .error(function(){
        alert('error');
      });
  }

  vm.addEvent = function(){
    if(!vm.newEvent.eventName){
      alert('Must provide name of event');
      return;
    }

    if(!vm.newEvent.eventDeadline){
      alert('Must specify deadline');
      return;
    }

    console.log(vm.newEvent);
    eventService
      .addEvent(vm.patent._id, vm.newEvent)
      .success(function(){
        vm.eventHistory.unshift(vm.newEvent);
        vm.newEvent = null;
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
}
