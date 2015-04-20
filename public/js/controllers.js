/*---------------------------------------------------------------HEADER CONTROLLERS --------------------------------------------------------------*/

app.controller('navController', ['$scope', '$rootScope', '$location', 'ngDialog', 'loginService', 'sessionService', function($scope, $rootScope, $location, ngDialog, loginService, sessionService){

    $scope.goLogin = function(){
        ngDialog.open({
            template: 'views/login.html',
            controller: 'loginController',
            className: 'ngdialog-theme-plain',
            scope: $rootScope
        });
    };

    $scope.goLogout = function() {
	    return loginService.logout();	
    };

    $scope.isLogged = function () {
        return sessionStorage.getItem('sid');
    };

}]);

/*---------------------------------------------------------------SECTION CONTROLLERS --------------------------------------------------------------*/

// FILTER CONTROLLER

app.controller('filterController', ['$scope', '$location', 'DatabaseRequest', function($scope, $location, DatabaseRequest){

    $scope.getClass = function(path) {
        if ($location.path().substr(0, path.length) == path) {
            return "selected"
        } else {
            return ""
        }
    }

    $scope.checkRoute = function () {
        if ($location.path() == '/action/place') { return 0 } else { return 1 };
    };

    $scope.isLogged = function () {
        return sessionStorage.getItem('sid');
    };

}]);


// MAIN PAGE CONTROLLER

app.controller('mainController', ['$scope', '$http', '$upload', 'DatabaseRequest', 'ngDialog', function ($scope, $http, $upload, DatabaseRequest, ngDialog) {
    
    DatabaseRequest.getData().success(function(data){  // null, null, null
        $scope.data = data;
    });

    $scope.pageHeading = "The latest ads";

    $scope.isLogged = function () {
        return sessionStorage.getItem('sid');
    };

    $scope.deleteItem = function (id, category) {

        ngDialog.open({
            template: 'views/confirm.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            preCloseCallback: function (value) {
                DatabaseRequest.getData().success(function (data) {
                    $scope.data = data;
                });
            },
            controller: ['$scope', 'DatabaseRequest', function ($scope, DatabaseRequest) {
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
            controller: ['$scope', '$location', 'DatabaseRequest', function ($scope, $location, DatabaseRequest) {
                DatabaseRequest.getData(id, category).success(function (data) {

                    $scope.item = data[0];

                    $scope.form = {
                        'title': data[0].title,
                        'category': data[0].category,
                        'description': data[0].description,
                        'price': data[0].price,
                        'name': data[0].name,
                        'city': data[0].city,
                        'phone': data[0].phone,
                        'email': data[0].email,
                        'image': data[0].image,
                        'id': id,
                        'category_p': category
                    }
                });

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
                        url: 'php/admin/update.php',
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

app.controller('categoryController', ['$scope', '$routeParams', 'DatabaseRequest', function ($scope, $routeParams, DatabaseRequest) {

    DatabaseRequest.getData(null, $routeParams.category, null).success(function(data) {
        $scope.data = data;
    });

    $scope.pageHeading = $routeParams.category;
   
}]);

// INFO PAGE CONTROLLER

app.controller('infoController', ['$scope', '$http', '$routeParams', '$location', 'DatabaseRequest', 'ngDialog', function ($scope, $http, $routeParams, $location, DatabaseRequest, ngDialog) {

    if ($location.path().substr(0, 6) == '/admin') {
        $scope.appr = true
    } else {
        $scope.appr = null
    };

    DatabaseRequest.getData($routeParams.id, $routeParams.category, $scope.appr).success(function(data) {
        $scope.item  = data[0];
    });

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

app.controller('placeController', ['$scope', '$http', '$upload', '$location', function ($scope, $http, $upload, $location) {

    $scope.onFileSelect = function($files) {
        var file = $files[0];
        if (file.type.indexOf('image') == -1) { $scope.error = 'Please choose a JPEG or PNG file.' }
        if (file.size > 2097152) { $scope.error = 'File size cannot exceed 2 MB.'; }
        $scope.upload = function() {
            $upload.upload({
                url: 'php/place.php',
                headers: { 'Content-Type': file.type },
                method: 'POST',
                data: $scope.form,
                file: file
            }).success(function(data) {
                $location.path('/');
            });
        }
    };

    $scope.sendForm = function () {
        return $scope.upload();
    }

}]);

// LOGIN POP-UP WINDOW CONTROLLER

app.controller('loginController', ['$scope', 'loginService', 'sessionService', function($scope, loginService){

	$scope.submitForm = function(){
		return loginService.login($scope.form, $scope);
	};

}]);


// ADMINISTRATION PAGE CONTROLLER

app.controller('adminController', ['$scope', 'DatabaseRequest', '$location', function ($scope, DatabaseRequest, $location) {
      
    DatabaseRequest.getData(null, null, true).success(function (data) {
        $scope.data = data;
    });

    $scope.show = function (ID, category) {
        $location.path('admin/' + category + '/' + ID);
    };

    $scope.pageHeading = 'Unapproved ads';

}]);