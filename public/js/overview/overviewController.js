angular
  .module('patentApp')
  .controller('overviewController', overviewController);

overviewController.$inject=['allPatents'];

function constructCalendarEvent(lastEvent){
  calendarEvent = {};
  calendarEvent.title = lastEvent.eventName;
  calendarEvent.start = lastEvent.eventDeadline;
  return calendarEvent;
}

function overviewController(allPatents){
  var vm = this;
  vm.patents = allPatents.data;
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
  for(var i = 0; i < vm.patents.length; i++){
    if(vm.patents[i].lastDeadline && vm.patents[i].lastDeadline.eventDeadline){
      //vm.eventSources.events.push(constructCalendarEvent(vm.patents[i].lastDeadline));
      vm.eventSources.events.push({
          title : vm.patents[i].lastDeadline.eventName,
          start : vm.patents[i].lastDeadline.eventDeadline,
          url   : 'starter.html#/manage/' + vm.patents[i]._id
      });
    }
  }
  console.log(vm.eventSources);
}
