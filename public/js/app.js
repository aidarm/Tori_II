var app = angular.module('tori', ['ngRoute', 'ngDialog', 'angularFileUpload']);

app.run(function($rootScope, $location) {
    $rootScope.location = $location;
});

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/index',
        {
            templateUrl: "views/main.html",
            controller: "mainController"
        }
    ).when('/items/:category',
        {
            templateUrl: "views/categ.html",
            controller: "categoryController"
        }
    ).when('/items/:category/:id',
        {
            templateUrl: "views/item.html",
            controller: "infoController"
        }
    ).when('/action/place',
        {
            templateUrl: "views/place.html",
            controller: "placeController"
        }
    ).when('/admin',
        {
            templateUrl: "views/admin.html",
            controller: "adminController"
        }
    ).when('/admin/:category/:id',
        {
            templateUrl: "views/un_item.html",
            controller: "infoController"
        }
    ).otherwise({redirectTo: '/index'});

    $locationProvider.html5Mode(true);

});

/*--------------------------------------------------------------- GLOBAL FUNCTIONS --------------------------------------------------------------*/

app.run(function($rootScope, $location){
    $rootScope.gogogo = function(hash) {
        $location.path(hash);
    }
})

app.run(function($rootScope, $location) {
    $rootScope.showItem = function (ID, category) {
        $location.path('items/' + category + '/' + ID);
    };
});

app.run(function($rootScope, $location, loginService){
    var routespermission = ['/admin'];
    $rootScope.$on('$routeChangeStart', function(){
        if (routespermission.indexOf($location.path().substr(0, 6)) != -1) {
	        var connected = loginService.isLogged();
	        connected.then(function(msg){
	            if (!msg.data) $location.path('/');
	        });
        }

    });
});

app.run(function ($rootScope, sessionService, loginService) {
    $rootScope.$watch(
        function () { sessionStorage.getItem('sid') },
        function () {
            loginService.isLogged().then(function (msg) {
                if (msg.data) { console.log(1) } else { console.log(0) };
            })
        }
    );
});

/*--------------------------------------------------------------- FACTORIES --------------------------------------------------------------*/

// GETTING DATA FROM THE JSON DECODED OBJECT

app.factory('DatabaseRequest', function ($http) {

    return {
        getData : function(id, category, appr) {
            return $http({
                url: 'php/data.php',
                method: 'GET',
                params: {
                    'id': id,
                    'category': category,
                    'appr' : appr
                }
            })
        }
    }
});

app.factory('sessionService', ['$http', function($http){

    return {
        set : function(key, value){
            return sessionStorage.setItem(key, value);
        },

        get : function(key){
            return sessionStorage.getItem(key);
        },

        destroy : function(key){
	        $http.post('php/session/destroy_session.php');
            return sessionStorage.removeItem(key);
        }
    };

}]);

app.factory('loginService', function($http, $location, sessionService){

    return {
        login : function(data, scope){
             return $http.post('php/session/login.php', data).then(function(msg){
                var id = msg.data;
                if (id && id != "sdf6s8d7f9") {
                    //var token = Math.random().toString(36).substring(7);
                    sessionService.set('sid', id);
                    scope.closeThisDialog();
                } else if (id == "sdf6s8d7f9") {
                    scope.message = "Your account has been locked out. Only 3 login attempts per minute are allowed.";
                } else {
                    scope.message = "There was an error with your username/password combination. Please try again.";
                }
            })
        },

	    logout : function(){
            sessionService.destroy('sid');
	        $location.path('/');
        },

        isLogged : function(){
	        var $checkSession = $http.post('php/session/check_session.php');
	        return $checkSession;
        }
    }

});

/*--------------------------------------------------------------- DIRECTIVES --------------------------------------------------------------*/

// HOVER OF ADS ON MAIN PAGE

app.directive('superHover', function() {
    return {
        link: function(scope, element) {
            element.bind('mouseenter', function() {
                angular.element(element).addClass('ad_hover');
            })
        }
    }
});

angular.module('initFromForm', [])
  .directive("initFromForm", function ($parse) {
      return {
          link: function (scope, element, attrs) {
              var attr = attrs.initFromForm || attrs.ngModel || element.attrs('name'),
              val = attrs.value;
              $parse(attr).assign(scope, val)
          }
      };
  });

/*--------------------------------------------------------------- FILTERS --------------------------------------------------------------*/

// FIRST LETTER CAPITALIZING

app.filter('capitalize', function () {
    return function (input, scope) {
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});