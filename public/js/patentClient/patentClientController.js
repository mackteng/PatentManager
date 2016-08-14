angular
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
