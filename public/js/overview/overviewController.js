angular
  .module('patentApp')
  .controller('overviewController', overviewController);

overviewController.$inject=['allEvents'];

function overviewController(allEvents){
  var vm = this;
  vm.events = allEvents.data;
  vm.eventSources = {events:[]}
  vm.config = {
    calendar:{
      height:800,
      header:{
          left: 'month basicWeek basicDay',
          center: 'title',
          right: 'today prev,next'
        }
    }
  }

  // populate events
  for(var i = 0; i < vm.events.length; i++){
    if(vm.events[i].completed == false){
      vm.eventSources.events.push(
        {
            title : vm.events[i].eventName,
            start : new Date(vm.events[i].eventDeadline),
            url   : 'starter.html#/manage/' + vm.events[i].patentID
        }
      );
    }
  }
}
