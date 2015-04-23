var app = angular.module('tori', ['ngRoute', 'ngDialog', 'angularFileUpload']);

app.run(function($rootScope, $location) {
    $rootScope.location = $location;
});

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/',
        {
            title: "Tori / Main page",
            templateUrl: "js/app/views/main.html",
            controller: "mainController"
        }
    ).when('/cat/:cat',
        {
            title: "Tori / Category",
            templateUrl: "js/app/views/cat.html",
            controller: "categoryController"
        }
    ).when('/item/view/:id',
        {
            title: "Tori / Item",
            templateUrl: "js/app/views/item.html",
            controller: "infoController"
        }
    ).when('/item/create',
        {
            title: "Tori / Place an ad",
            templateUrl: "js/app/views/place.html",
            controller: "placeController"
        }
    ).when('/admin',
        {
            title: "Tori / Test",
            templateUrl: "js/app/views/admin.html",
            controller: "adminController"
        }
    ).when('/admin/view/:id',
        {
            title: "Tori / Test",
            templateUrl: "js/app/views/un_item.html",
            controller: "infoController"
        }
    ).otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);

});

/*--------------------------------------------------------------- GLOBAL FUNCTIONS --------------------------------------------------------------*/

// app.run(function($rootScope, $location, $http) {
//   $rootScope.$watch(function() { 
//       return $location.path(); 
//     },
//     function(a){
//       console.log('URL has changed to: ' + a);
//       $http.get(a)
//         .success(function(data) {
//             //console.log("this is coming from wherever:");
//     });
//     });
// });

// app.run(['$location', '$rootScope', function($location, $rootScope) {
//     $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
//         $rootScope.title = current.$$route.title;
//     });
// }]);

app.run(function($rootScope, $location){
    $rootScope.gogogo = function(hash) {
        $location.path(hash);
    }
})

app.run(function($rootScope, $http){
    $rootScope.getIt = function(path) {
        $http.get(path).success(function(data) {
            console.log("sdadadsads");
        })
    }
})

app.run(function($rootScope, $location) {
    $rootScope.showItem = function (ID, category) {
        $location.path('item/view/' + ID);
    };
});


/*--------------------------------------------------------------- FACTORIES --------------------------------------------------------------*/

// GETTING DATA FROM THE JSON DECODED OBJECT

// app.factory('DatabaseRequest', function ($http) {

//     return {
//         getData : function(id, category, appr) {
//             return $http({
//                 url: '//localhost:27017/test/item/',
//                 method: 'GET',
//                 params: {
//                     'id': id,
//                     'category': category,
//                     'appr' : appr
//                 }
//             })
//         }
//     }
// });


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
    };
});