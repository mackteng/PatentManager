angular
  .module('patentApp')
  .controller('emailMenuController', emailMenuController);

  emailMenuController.$inject=['$uibModalInstance','allTemplates','patentId'];
  function emailMenuController($uibModalInstance, allTemplates, patentId){
    var vm = this;
    vm.templates = allTemplates.data;
    vm.patentId = patentId;
    vm.dismiss = function(){
      $uibModalInstance.dismiss('cancel');
    }
  }
