angular.module('patentApp').controller('newPatentFormController', newPatentFormController);
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
