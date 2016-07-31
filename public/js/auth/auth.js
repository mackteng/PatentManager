angular
  .module('patentApp')
  .service('authentication', authentication);

  authentication.$inject=['$window', 'config'];

  function authentication($window, config){
    var baseUrl = config.baseUrl;
    var saveToken = function(token){
        $window.localStorage["token"] = token;
    }
    var getToken = function(token){
      return $window.localStorage["token"];
    }
    var register = function(user){
      return $http.post(baseUrl + 'register/', user).success(function(data){
          saveToken(data);
      });
    }

    var login = function(user){
      return $http.post(baseUrl + 'login/', user).success(function(data){
          saveToken(data);
      });
    }

    var logout = function() {
      $window.localStorage.removeItem('loc8r-token');
    };

    var isLoggedIn = function(){
      var token = getToken();
      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    }

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return {
          email : payload.email,
          name : payload.name
        };
      }
    };

    return {
      saveToken : saveToken,
      getToken : getToken,
      register: register,
      login : login,
      logout : logout,
      isLoggedIn : isLoggedIn,
      currentUser : currentUser
    };
  };
