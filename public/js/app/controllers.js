/*---------------------------------------------------------------HEADER CONTROLLERS --------------------------------------------------------------*/

app.controller('navController', ['$scope', '$rootScope', 'ngDialog', function($scope, $rootScope, ngDialog){

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
    
    $scope.pageHeading = "The latest ads";
    
    $http.post("/").success(function(data) {
        $scope.data = data;
    });

    $scope.deleteItem = function (id){
        ngDialog.open({
            template: 'js/app/views/confirm.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            preCloseCallback: function (value) {
                // DatabaseRequest.getData().success(function (data) {
                //     $scope.data = data;
                // });
            },
            controller: ['$scope', function ($scope) {
                $scope.message = "Delete?";
                $scope.dosmth = function (x) {
                    if (x == 'yes') {
                        $http({
                            url: 'api/reject',
                            method: 'POST',
                            data: {
                                'id': id
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

    $scope.editItem = function (id) {
        ngDialog.open({
            template: 'js/app/views/edit.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', '$location', function ($scope, $location) {
                $http({
                    url: "item/view/" + id,
                    method: "POST"
                }).success(function (data) {
                    $scope.item = data;
                    $scope.form = {
                        'title': data.title,
                        'category': data.category,
                        'description': data.description,
                        'price': data.price,
                        'name': data.name,
                        'city': data.city,
                        'phone': data.phone,
                        'img': data.img,
                        '_id': data._id
                    }
                });

                // $scope.onFileSelect = function ($files) {
                //     var file = $files[0];
                //     if (file.type.indexOf('image') == -1) { $scope.error = 'Please choose a JPEG or PNG file.' }
                //     if (file.size > 2097152) { $scope.error = 'File size cannot exceed 2 MB.'; }
                //     $scope.upload = $upload.upload({
                //             url: 'php/admin/update.php',
                //             headers: { 'Content-Type': file.type },
                //             method: 'POST',
                //             data: $scope.form,
                //             file: file
                //     }).success(function (data) {
                //         $scope.form.image = data;
                //     })
                // };

                $scope.sendForm = function () {
                    $http({
                        url: 'api/update',
                        method: 'POST',
                        data: $scope.form
                    }).success(function (data) {
                        $scope.closeThisDialog();
                        $location.path('/');
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
    
    $http.post($location.path()).success(function(data) {
        $scope.item = data;
    });

    $scope.approve = function (id) {
        ngDialog.open({
            template: 'js/app/views/confirm.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            controller: ['$scope', '$http', function ($scope, $http) {
                $scope.message = "Approve?";
                $scope.dosmth = function (x) {
                    if (x == 'yes') {
                        $http({
                            url: 'api/approve',
                            method: 'POST',
                            data: {
                                'id': id
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

    $scope.reject = function (id) {
        ngDialog.open({
            template: 'js/app/views/confirm.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            controller: ['$scope', function ($scope) {
                $scope.message = "Reject?";
                $scope.dosmth = function (x) {
                    if (x == 'yes') {
                        $http({
                            url: 'api/reject',
                            method: 'POST',
                            data: {
                                'id': id
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

// AD PLACING PAGE CONTROLLER

app.controller('placeController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    
    $scope.form = {};
    // TODO: Implement error mesage
    
    $scope.submitForm = function() {
        $http.post('/api/upload', $scope.form).
            success(function(data) {
                console.log("The ad was placed");
                $location.path('/');
            }).error(function(err) {
                $scope.errorMessage = err;
            });
    }

}]);

// LOGIN POP-UP WINDOW CONTROLLER

app.controller('loginController', ['$scope', '$http', '$location', '$window', 'ngDialog', function($scope, $http, $location, $window, ngDialog){
    
    // TODO: Implement error mesage
    
    $scope.submitForm = function() {
        $http.post('/api/login', $scope.form).
            success(function(data) {
                $scope.closeThisDialog();
                $location.path("/");
                console.log("Signed in successfully");
            }).error(function(err) {
                console.log("Invalid credentials");
                $scope.errorMessage = err;
            });
    }

}]);


// ADMINISTRATION PAGE CONTROLLER

app.controller('adminController', ['$scope', '$location', '$http', function ($scope, $location, $http) {
      
    // DatabaseRequest.getData(null, null, true).success(function (data) {
    //     $scope.data = data;
    // });
    
    $scope.pageHeading = 'Unapproved ads';
    
    var path = $location.path();
    
    $http.post(path).success(function(data) {
        $scope.data = data;
    })

    $scope.show = function (ID, category) {
        $location.path('admin/' + ID);
    };

}]);