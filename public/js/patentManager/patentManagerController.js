angular.module('patentApp').controller('patentController', patentController);
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
  vm.search={};

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
