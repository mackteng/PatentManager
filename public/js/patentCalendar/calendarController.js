angular
  .module('patentApp')
  .controller('calendarController', calendarController);

calendarController.$inject=['allEvents'];

function calendarController(allEvents){
  var vm = this;
  vm.events = allEvents.data;
  vm.eventSources = {events:[]}
  vm.config = {
    calendar:{
      height:800,
      header:{
          left: 'month',
          center: 'title',
          right: 'today prev,next'
      },
      timeFormat: ''
    }
  }

  for(var i = 0; i < vm.events.length; i++){
    vm.events[i].eventDeadline = (new Date(vm.events[i].eventDeadline)).toLocaleDateString();
  }

  // populate events
  for(var i = 0; i < vm.events.length; i++){
    if(!vm.events[i].completed){
      vm.eventSources.events.push(
        {
            title : vm.events[i].eventName,
            start : new Date(vm.events[i].eventDeadline),
            url   : '#/manage/' + vm.events[i].patentID,
            allDay: true
        }
      );
    }
  }

  vm.gridOptions = {
    enableFiltering: true,
    data: vm.events,
    enablePaginationControls: true,
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    rowHeight:50,
    enableGridMenu: true,
    exporterMenuCsv: true,
    exporterMenuPdf: false,
    exporterOlderExcelCompatibility: true,
    columnDefs:[
      {field: 'eventName.split(" ")[2]', displayName: 'Type'},
      {field: 'eventName.split(" ")[0]', displayName: 'Docket Number'},
      {field: 'eventDeadline', displayName: 'Deadline', cellFilter: 'date'},
      {field: 'completed', displayName: 'Completed', filter: {
          term: false,
          condition: function(searchTerm, cellValue, row, column){
            return cellValue === searchTerm;
          }
      }}
    ]
  };




}
