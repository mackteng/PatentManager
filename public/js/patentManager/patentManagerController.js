angular.module('patentApp').controller('patentController', patentController);
patentController.$inject=['allPatents', 'allClients', '$uibModal', '$log'];
function patentController(allPatents, allClients, $uibModal){
  var vm = this;
  // patents
  vm.patents = allPatents.data;
  vm.clients = allClients.data;

  for(var i = 0; i < vm.patents.length; i++){
    vm.patents[i].filingDate = (new Date(vm.patents[i].filingDate)).toLocaleDateString();
  }

  vm.pad = function(str){
    while(str.length < 3) str = '0' + str;
    return str;
  }

  vm.gridOptions = {
    enableFiltering: true,
    data: vm.patents,
    enablePaginationControls: true,
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    enableGridMenu: true,
    exporterMenuCsv: true,
    exporterMenuPdf: false,
    columnDefs:[
      {field: 'litronDocketNumber', width:"10%", displayName: 'Docket Number', cellTemplate:'<div class="ui-grid-cell-contents">' + '<a href="#/manage/' + '{{row.entity._id}}' + '">' + '{{row.entity.litronDocketNumber}}' + "</a>"},
      {field: 'clientDocketNumber', width:"10%", displayName: 'Client Docket Number'},
      {field: 'applicationType', width:"5%", displayName: 'Type'},
      {field: 'country', width:"5%", displayName: 'Country'},
      {field: 'filingNumber', width: "10%", displayName: 'Application Number'},
      {field: 'filingDate', width: "10%", displayName: 'Filing Date', cellFilter: 'date'},
      {field: 'englishTitle', width: "15%", displayName: 'English Title'},
      {field: 'chineseTitle', width: "15%", displayName: 'Chinese Title'},
      {field: 'status', width: "5%", displayName: 'Status', filter:{
        term: 'Active'
      }},
      {field: 'comments', width:"15%", displayName: 'Comments', cellTemplate:'<div ng-repeat="item in row.entity[col.field]">{{item}}</div>'}
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
