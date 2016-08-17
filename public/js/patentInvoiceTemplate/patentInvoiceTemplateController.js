angular
  .module('patentApp')
  .controller('patentInvoiceTemplateController', patentInvoiceTemplateController);
  patentInvoiceTemplateController.$inject=['Upload', 'invoices'];

  function patentInvoiceTemplateController(Upload, invoices){
    var vm = this;
    vm.invoices = invoices.data;
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

    vm.uploadFile = function(file){
      vm.f = file;
      if(file){
          file.upload = Upload.upload({
            url: 'api/invoices',
            data: {file: file}
          })
          file.upload.then(function (response) {
                vm.invoices.push(file.name);
            }, function (response) {
                if (response.status > 0)
                    vm.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
      }
    };

  }
