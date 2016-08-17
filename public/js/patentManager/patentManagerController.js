angular.module('patentApp').controller('patentController', patentController);
patentController.$inject=['allPatents', 'allClients', '$uibModal', '$log'];
function patentController(allPatents, allClients, $uibModal){
  var vm = this;
  // patents
  vm.patents = allPatents.data;
  vm.clients = allClients.data;

  function pad(str){
    while(str.length < 3) str = '0' + str;
    return str;
  }

  vm.gridOptions = {
    enableFiltering: true,
    data: vm.patents,
    enablePaginationControls: true,
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    rowHeight:50,
    columnDefs:[
      {field: 'litronDocketNumber', displayName: 'Docket Number', cellTemplate:'<div class="ui-grid-cell-contents">' + '<a href="#/manage/' + '{{row.entity._id}}' + '">' + '{{row.entity.litronDocketNumber}}' + "</a>"},
      {field: 'clientDocketNumber', displayName: 'Client Docket Number'},
      {field: 'applicationType', displayName: 'Application Type'},
      {field: 'filingDate', displayName: 'Filing Date', cellFilter: 'date'},
      {field: 'englishTitle', displayName: 'English Title'},
      {field: 'chineseTitle', displayName: 'Chinese Title'},
      {field: 'comments[0]', displayName: 'LastActivity'},
      {field: 'status', displayName: 'Status'}
    ]
  };


  // advanced search collapse variable and functions
  vm.advancedSearchCollapse = true;
  vm.toggleAdvancedSearch = function(){
    vm.advancedSearchCollapse = !vm.advancedSearchCollapse;
  }

  // ordering properties
  vm.orderProperty='clientId';
  vm.reverse=false;
  vm.changeOrder = function(property){
      if(vm.orderProperty === property){
        vm.reverse = !vm.reverse;
      } else {
        vm.reverse = false;
        vm.orderProperty = property;
      }
  };

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
