angular
  .module('patentApp')
  .controller('invoiceMenuController', invoiceMenuController);

  invoiceMenuController.$inject=['$uibModalInstance','allInvoices','patentId'];
  function invoiceMenuController($uibModalInstance, allInvoices, patentId){
    var vm = this;
    vm.invoices = allInvoices.data;
    vm.patentId = patentId;
    vm.dismiss = function(){
      $uibModalInstance.dismiss('cancel');
    }
  }
