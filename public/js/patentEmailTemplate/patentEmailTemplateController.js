angular
  .module('patentApp')
  .controller('patentEmailTemplateController', patentEmailTemplateController);

  patentEmailTemplateController.$inject=['$scope', 'emailTemplates', 'emailTemplateService'];
  var nargs = /\{([0-9a-zA-Z_]+)\}/g
  function template(string) {
    var args

    if (arguments.length === 2 && typeof arguments[1] === "object") {
        args = arguments[1]
    } else {
        args = new Array(arguments.length - 1)
        for (var i = 1; i < arguments.length; ++i) {
            args[i - 1] = arguments[i]
        }
    }

    if (!args || !args.hasOwnProperty) {
        args = {}
    }

    return string.replace(nargs, function replaceArg(match, i, index) {
        var result

        if (string[index - 1] === "{" &&
            string[index + match.length] === "}") {
            return i
        } else {
            result = args.hasOwnProperty(i) ? args[i] : null
            if (result === null || result === undefined) {
                return ""
            }

            return result
        }
    })
  }

  function patentEmailTemplateController($scope, emailTemplates, emailTemplateService){
    var vm = this;
    vm.template = template;
    vm.emailTemplates = emailTemplates.data;
    vm.testEvent = {
      "litronDocketNumber" : "6102.012US",
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
    vm.populatedBody = 'Start typing in your template';
    vm.loadTemplate = function($index){
      vm.templateName = vm.emailTemplates[$index].name;
      vm.templateSubject = vm.emailTemplates[$index].subject;
      vm.templateBody = vm.emailTemplates[$index].content;
    }
    vm.saveTemplate = function(){
      var temp = {
        name: vm.templateName,
        subject: vm.templateSubject,
        content: vm.templateBody
      };
      emailTemplateService
        .addEmailTemplate(temp)
        .success(function(template){
          vm.emailTemplates.push(temp);
        })
        .error(function(err){
          alert(err);
          console.log(err);
        });
    }

  }
