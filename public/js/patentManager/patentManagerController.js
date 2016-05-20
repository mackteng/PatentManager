angular.module('patentApp').controller('patentController', patentController);
angular.module('patentApp').controller('newPatentFormController', newPatentFormController);

patentController.$inject=['allPatents', 'allClients', '$uibModal', '$log'];
newPatentFormController.$inject=['$uibModalInstance', 'allClients', 'patentService'];

function patentController(allPatents, allClients, $uibModal){
  var vm = this;
  // patents
  vm.patents = allPatents.data;
  vm.clients = allClients.data;

  // advanced search collapse variable and functions
  vm.advancedSearchCollapse = true;
  vm.toggleAdvancedSearch = function(){
    vm.advancedSearchCollapse = !vm.advancedSearchCollapse;
  }

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
    //alert(JSON.stringify(vm.patent, null, 4));
    // validate
    if(!vm.clientId || !vm.docketNumber || !vm.country || !vm.filingDate || !vm.filingNumber || !vm.applicationType || !vm.englishTitle){
      vm.setMessage('danger', 'Please fill in the required fields!');
      return false;
    }
    // send
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
