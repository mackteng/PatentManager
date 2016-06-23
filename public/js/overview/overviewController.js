angular
  .module('patentApp')
  .controller('overviewController', overviewController);

overviewController.$inject=['allPatents'];

function overviewController(allPatents){
  var vm = this;
  vm.patents = allPatents.data;
  vm.eventSources=[];

  console.log(vm.patents);






}
