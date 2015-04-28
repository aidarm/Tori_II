var app = angular.module('tori', ['ngRoute', 'ngDialog', 'ngFileUpload', 'angular-flexslider', 'vcRecaptcha', 'duScroll']);

app.run(function($rootScope, $location) {
    $rootScope.location = $location;
    $rootScope.weareon = null;
});

app.value('duScrollDuration', 1000);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/list/:list/:page',
        {
            templateUrl: "js/app/views/list.html",
            controller: listCTRL,
            resolve: listCTRL.resolve
        }
    ).when('/item/view/:id',
        {
            templateUrl: "js/app/views/item.html",
            controller: itemCTRL,
            resolve: itemCTRL.resolve
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

app.factory('Database', function ($http) {

    return {
        getData : function(query) {
            return $http({
                url: 'api/data',
                method: 'GET',
                params: { query }
            })
        }
    }
});

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

app.directive('watchChange', function() {
    return {
        scope: {
            onchange: '&watchChange'
        },
        link: function(scope, element, attrs) {
            element.on('input', function() {
                scope.onchange();
            });
        }
    };
});

app.service("directiveService", function() {
    var listeners = [];
    return {
        subscribe: function(callback) {
            listeners.push(callback);
        },
        publish: function(msg) {
            angular.forEach(listeners, function(value, key) {
                value(msg);
            });
        }
    };
});

app.directive('pagibox', function(directiveService, $compile) {
    //directiveService.subscribe(function(msg) {
    return {
        restrict: 'E',
        link: function(scope, iel, attr) {
            var svg = $compile('<div id="pagination" data-ng-if="!boxShow()"><button data-ng-class="{invisibleArrow: isHidden()}" data-ng-disabled="isHidden()" data-ng-click="previousPage()" data-icon="&#xe60c";></button><input type="text" maxlength="3" data-ng-model="pageNumber" data-ng-enter="goToPage(pageNumber)"><button data-ng-class="{invisibleArrow: arrowHShow()}" data-ng-click="nextPage()" data-icon="&#xe60d;"></button> <br/><p>/{{pageLimit}}</p></div>')( scope );
            iel.html(svg);
        
        }
    }//});
})

app.directive("jQueryDirective", function(directiveService) {
    directiveService.subscribe(function(msg) {
        // pretend this is jQuery 
        document.getElementById("example").innerHTML = msg;
    });
    return {
        restrict: 'E',
        transclude: true,
        //templateUrl: "js/app/templates/pagibox.html"
    };
});

/*--------------------------------------------------------------- FILTERS --------------------------------------------------------------*/

// FIRST LETTER CAPITALIZING

app.filter('capitalize', function () {
    return function (input, scope) {
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
});