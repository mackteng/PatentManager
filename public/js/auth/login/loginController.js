angular
  .module('patentApp')
  .controller('loginController', ['authentication', '$state', loginController]);

  function loginController(authentication, $state){
    var vm = this;
    vm.error = '';

    vm.login = function(){
      if(!vm.email || !vm.password){
          alert('Both fields must be filled in');
      } else {
          authentication.login({
              email: vm.email,
              password: vm.password
          }).error(function(err){
            vm.error = err.message;
            vm.email = '';
            vm.password = '';
          }).then(function(){
            $state.go('overview');
          });
      }
    }
  };
