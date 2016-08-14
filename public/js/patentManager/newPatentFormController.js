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
