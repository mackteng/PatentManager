angular
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
