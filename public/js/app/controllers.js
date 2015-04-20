/*---------------------------------------------------------------HEADER CONTROLLERS --------------------------------------------------------------*/

app.controller('navController', ['$scope', '$rootScope', '$location', 'ngDialog', function($scope, $rootScope, $location, ngDialog){

    $scope.goLogin = function(){
        ngDialog.open({
            template: 'js/app/views/login.html',
            controller: 'loginController',
            className: 'ngdialog-theme-plain',
            scope: $rootScope
        });
    };

}]);

/*---------------------------------------------------------------SECTION CONTROLLERS --------------------------------------------------------------*/

// FILTER CONTROLLER

app.controller('filterController', ['$scope', '$location', function($scope, $location){

    $scope.checkRoute = function () {
        if ($location.path() == '/item/create') { return 0 } else { return 1 };
    };

}]);


// MAIN PAGE CONTROLLER

app.controller('mainController', ['$scope', '$http', '$upload', 'ngDialog', function ($scope, $http, $upload, ngDialog) {
    
    // DatabaseRequest.getData().success(function(data){  // null, null, null
    //     $scope.data = data;
    // });

    $scope.pageHeading = "The latest ads";

    $scope.deleteItem = function (id, category) {
        ngDialog.open({
            template: 'views/confirm.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            preCloseCallback: function (value) {
                // DatabaseRequest.getData().success(function (data) {
                //     $scope.data = data;
                // });
            },
            controller: ['$scope', 'DatabaseRequest', function ($scope) {
                $scope.message = "Delete?";
                $scope.dosmth = function (x) {
                    if (x == 'yes') {
                        $http({
                            url: 'php/admin/delete.php',
                            method: 'POST',
                            data: {
                                'id': id,
                                'category': category
                            }
                        }).success(function () {
                            $scope.closeThisDialog();           
                        })
                    } else {
                        $scope.closeThisDialog();
                    }
                }
            }]
        });

    };

    $scope.editItem = function (id, category) {
        ngDialog.open({
            template: 'views/edit.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', '$location', function ($scope, $location) {
                // DatabaseRequest.getData(id, category).success(function (data) {

                //     $scope.item = data[0];

                //     $scope.form = {
                //         'title': data[0].title,
                //         'category': data[0].category,
                //         'description': data[0].description,
                //         'price': data[0].price,
                //         'name': data[0].name,
                //         'city': data[0].city,
                //         'phone': data[0].phone,
                //         'email': data[0].email,
                //         'image': data[0].image,
                //         'id': id,
                //         'category_p': category
                //     }
                // });

                $scope.onFileSelect = function ($files) {
                    var file = $files[0];
                    if (file.type.indexOf('image') == -1) { $scope.error = 'Please choose a JPEG or PNG file.' }
                    if (file.size > 2097152) { $scope.error = 'File size cannot exceed 2 MB.'; }
                    $scope.upload = $upload.upload({
                            url: 'php/admin/update.php',
                            headers: { 'Content-Type': file.type },
                            method: 'POST',
                            data: $scope.form,
                            file: file
                    }).success(function (data) {
                        $scope.form.image = data;
                    })
                };

                $scope.sendForm = function () {
                    $http({
                        url: 'item/create',
                        method: 'POST',
                        data: $scope.form
                    }).success(function (data) {
                        $scope.closeThisDialog();
                        $location.path('/');
                        console.log(data);
                    })
                }

                $scope.cancelForm = function () {
                    $scope.closeThisDialog();
                }
            }]
        });
    }

}]);

// CATEGORY PAGE CONTROLLER

app.controller('categoryController', ['$scope', '$routeParams', function ($scope, $routeParams) {

    // DatabaseRequest.getData(null, $routeParams.category, null).success(function(data) {
    //     $scope.data = data;
    // });

    $scope.pageHeading = $routeParams.cat;
   
}]);

// INFO PAGE CONTROLLER

app.controller('infoController', ['$scope', '$http', '$routeParams', '$location', 'ngDialog', function ($scope, $http, $routeParams, $location, ngDialog) {

    if ($location.path().substr(0, 6) == '/admin') {
        $scope.appr = true
    } else {
        $scope.appr = null
    };

    // DatabaseRequest.getData($routeParams.id, $routeParams.category, $scope.appr).success(function(data) {
    //     $scope.item  = data[0];
    // });

    $scope.hideButtShowPar = false;

    $scope.showContacts = function(){
        $scope.hideButtShowPar = true;
    }

    $scope.approve = function (id, category) {
        ngDialog.open({
            template: 'views/confirm.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            controller: ['$scope', '$http', function ($scope, $http) {
                $scope.message = "Approve?";
                $scope.dosmth = function (x) {
                    if (x == 'yes') {
                        $http({
                            url: 'php/admin/approve.php',
                            method: 'POST',
                            data: {
                                'id': id,
                                'category': category
                            }
                        }).success(function () {
                            $scope.closeThisDialog();
                            $location.path('/admin');
                        })
                    } else {
                        $scope.closeThisDialog();
                    }
                }
            }]
        });
    }

    $scope.reject = function (id, category) {
        ngDialog.open({
            template: 'views/confirm.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            controller: ['$scope', function ($scope) {
                $scope.message = "Reject?";
                $scope.dosmth = function (x) {
                    if (x == 'yes') {
                        $http({
                            url: 'php/admin/delete.php',
                            method: 'POST',
                            data: {
                                'id': id,
                                'category': category
                            }
                        }).success(function () {
                            $scope.closeThisDialog();
                            $location.path('/admin');
                        })
                    } else {
                        $scope.closeThisDialog();
                    }
                }
            }]
        });
    }

}]);

// PLACING PAGE CONTROLLER

app.controller('placeController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    
    // $http.get("/item/create")
    //     .success(function(data) {
    //         console.log("this is coming from wherever:" + data);
    // });
    
    $scope.form = {};
    $scope.errorMessage = '';
    
    $scope.submitForm = function() {
        console.log("dsffdsfdssfd");
        console.log($scope.form);
        
        $http.post('/item/create', $scope.form).
            success(function(data) {
                $scope.closeThisDialog();
                console.log(data);
                $location.path('/');
            }).error(function(err) {
                $scope.errorMessage = err;
            });
    }

}]);

// LOGIN POP-UP WINDOW CONTROLLER

app.controller('loginController', ['$scope', '$http', '$location', '$window', 'ngDialog', function($scope, $http, $location, $window, ngDialog){

// 	$scope.submitForm = function(){
// 		return loginService.login($scope.form, $scope);
// 	};

    $scope.form = {};
    $scope.errorMessage = '';
    
    $scope.submitForm = function() {
        console.log("dsffdsfdssfd");
        console.log($scope.form);
        
        $http.post('/login', $scope.form).
            success(function(data) {
                console.log(data);
                //$location.path('/');
                $window.location.reload();
            }).error(function(err) {
                console.log("ERROR!");
                $scope.errorMessage = err;
            });
    }

}]);


// ADMINISTRATION PAGE CONTROLLER

app.controller('adminController', ['$scope', '$location', function ($scope, $location) {
      
    // DatabaseRequest.getData(null, null, true).success(function (data) {
    //     $scope.data = data;
    // });

    $scope.show = function (ID, category) {
        $location.path('admin/' + category + '/' + ID);
    };

    $scope.pageHeading = 'Unapproved ads';

}]);