angular.module('patentApp').controller('patentController', patentController);
angular.module('patentApp').controller('newPatentFormController', newPatentFormController);

patentController.$inject=['allPatents', '$uibModal', '$log'];
newPatentFormController.$inject=['$uibModalInstance', 'patentService'];

function patentController(allPatents, $uibModal){
  var vm = this;
  // patents
  vm.patents = allPatents.data;
  vm.clients = null;

  // advanced search collapse variable and functions
  vm.advancedSearchCollapse = true;
  vm.toggleAdvancedSearch = function(){
    vm.advancedSearchCollapse = !vm.advancedSearchCollapse;
  }

  // new patent form variable and functions
  vm.newPatentForm = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'js/patentManager/newPatentForm.html',
      size: 'lg',
      backdrop : 'static',
      controller: 'newPatentFormController',
      controllerAs: 'vm'
    });

    modalInstance.result.then(function(patent){
      vm.patents.push(patent);
    });
  }
}

function newPatentFormController($uibModalInstance, patentService){
  var vm = this;

  // patent application
  vm.patent = {};

  // message alert
  vm.message = {
    type: 'success',
    content: null
  }
  vm.closeMessage = function(){
    vm.message.content = null;
  }
  vm.addMessage = function(type,message){
    vm.message.type = message;
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

    // send
    patentService
      .addNewPatent(vm.patent)
      .success(function(data){
        $uibModalInstance.close(data);
      })
      .error(function(data){
        vm.message = "Error Occured. Patent Not Saved";
      });
  };

  // cancel
  vm.cancel = function(){
    $uibModalInstance.close();
  };
}
