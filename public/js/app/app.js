var app = angular.module('tori', ['ngRoute', 'ngDialog', 'ngFileUpload', 'angular-flexslider']);

app.run(function($rootScope, $location) {
    $rootScope.location = $location;
});

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/list/:list/:page',
        {
            templateUrl: "js/app/views/list.html",
            controller: "listCTRL"
        }
    ).when('/item/view/:id',
        {
            templateUrl: "js/app/views/item.html",
            controller: "itemCTRL"
        }
    ).when('/item/new',
        {
            templateUrl: "js/app/views/new.html",
            controller: "newCTRL"
        }
    ).otherwise({redirectTo: '/list/all/1'});

    $locationProvider.html5Mode(true);

});

/*--------------------------------------------------------------- GLOBAL FUNCTIONS --------------------------------------------------------------*/

app.run(function($rootScope, $location){
    $rootScope.go = function(hash) {
        $location.path(hash);
    }
})

app.run(function($rootScope, $location) {
    $rootScope.view = function (ID, category) {
        $location.path('item/view/' + ID);
    };
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
  
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

/*--------------------------------------------------------------- FILTERS --------------------------------------------------------------*/

// FIRST LETTER CAPITALIZING

app.filter('capitalize', function () {
    return function (input, scope) {
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
});