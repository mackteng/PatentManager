angular
  .module('patentApp')
  .controller('patentEmailTemplateController', patentEmailTemplateController);

  patentEmailTemplateController.$inject=['$sce']

  function patentEmailTemplateController($sce){
    var vm = this;
    vm.testEvent = {
      "status": "Active",
      "patentExpirationDate": "",
      "patentType": "Patent",
      "filingDate": new Date("2015-05-13T00:00:00"),
      "filingNumber": "104115268",
      "country": "TW",
      "issueNumber": "",
      "englishTitle": "Choke",
      "chineseTitle": "電磁元件及其線圈結構",
      "docketNumber": "012",
      "clientDocketNumber": "RD-101007-TW-1-D1",
      "publicationDate": "",
      "applicationType": "REG",
      "clientNumber": "6101",
      "clientTelephone": "02-20455641",
      "clientChineseName" : "乾坤科技",
      "clientEnglishName" : "Cyntec Co. Ltd.",
      "clientChineseAddress" : "新竹市新竹科學工業園區研發二路2號",
      "clientEnglishAddress" : "No. 2, R&D 2nd Road, Baoshan Township, Hsinchu County, 30076",
      "clientRepChineseName": "陳世偉",
      "clientRepEnglishName": "Gary"
    };
    vm.gmailURL = $sce.trustAsResourceUrl("http://mail.google.com/mail/?compose=1&view=cm&fs=1");
    vm.populatedBody = 'hello';


  }
