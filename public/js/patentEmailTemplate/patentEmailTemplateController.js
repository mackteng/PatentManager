angular
  .module('patentApp')
  .controller('patentEmailTemplateController', patentEmailTemplateController);

  function patentEmailTemplateController(){
    var vm = this;
    vm.testEvent = {
      "status": "Active",
      "patentExpirationDate": "",
      "patentType": "Patent",
      "filingDate": "2015-05-13T00:00:00",
      "filingNumber": "104115268",
      "country": "TW",
      "issueNumber": "",
      "clientId": "6101",
      "chineseTitle": "電磁元件及其線圈結構",
      "docketNumber": 105,
      "clientDocketNumber": "RD-101007-TW-1-D1",
      "publicationDate": "",
      "Comment": "",
      "applicationType": "REG"
    };




  }
