angular
  .module('patentApp')
  .controller('patentClientController', patentClientController);

  patentClientController.$inject=['allClients', '$uibModal'];

  function patentClientController(allClients, $uibModal){
    var vm = this;
    vm.clients = allClients.data;

    vm.gridOptions = {
      enableFiltering: true,
      data: vm.clients,
      enablePaginationControls: true,
      paginationPageSizes: [10,20],
      paginationPageSize: 10,
      columnDefs:[
        {field: '_id', displayName: 'ClientID', width:"5%", cellTemplate: '<a href="#/clients/' + '{{row.entity._id}}' + '">' + '{{row.entity._id}}' + '</a>'},
        {field: 'chineseName', displayName: 'Chinese Name'},
        {field: 'englishName', displayName: 'English Name'},
        {field: 'chineseAddress', displayName: 'Chinese Address'},
        {field: 'englishAddress', displayName: 'English Address'},
        {field: 'telephone', displayName: 'Telephone'},
        {field: 'comment', displayName: 'Comments'}
      ]
    };

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
      modalInstance.result.then(function(client){
        vm.clients.push(client);
      });
    }
  }
