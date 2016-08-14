angular.module('patentApp').controller('newClientFormController', newClientFormController);
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
