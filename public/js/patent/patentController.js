angular.module('patentApp').controller('patentController', patentController);

patentController.$inject=['patentData'];
function patentController(patentData){
  var vm = this;

  // patents
  vm.patents = patentData.data;

  // menu collapse variable and functions
  vm.patentFormCollapse = true;
  vm.advancedSearchCollapse = true;

  vm.togglePatentForm = function(){
    vm.patentFormCollapse = false;
    vm.advancedSearchCollapse = true;
  }

  vm.toggleAdvancedSearch = function(){
    vm.patentFormCollapse = true;
    vm.advancedSearchCollapse = false;
  }



}
