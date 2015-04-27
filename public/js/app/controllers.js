/*---------------------------------------------------------------HEADER CONTROLLERS --------------------------------------------------------------*/

app.controller('headCTRL', ['$scope', '$rootScope', '$location', 'ngDialog', function($scope, $rootScope, $location, ngDialog){
    
    //$scope.title = "To edit";

}]);

app.controller('navController', ['$scope', '$rootScope', '$http', 'ngDialog', function($scope, $rootScope, $http, ngDialog){

    $scope.signin = function(){
        ngDialog.open({
            template: 'js/app/views/signin.html',
            controller: 'signinCTRL',
            className: 'ngdialog-theme-plain',
            scope: $rootScope
        });
    };
    
    $scope.get = function(path) {
        $http.get(path).success(function(){
            location.reload();
        });
    }

}]);

/*---------------------------------------------------------------SECTION CONTROLLERS --------------------------------------------------------------*/

// FILTER CONTROLLER

app.controller('filterController', ['$scope', '$location', function($scope, $location){

    $scope.checkRoute = function () {
        if ($location.path() == '/item/new') { return 0 } else { return 1 };
    };

}]);


// LIST PAGE CONTROLLER

app.controller('listCTRL', ['$scope', '$http', 'Upload', '$location', '$routeParams', 'ngDialog', function ($scope, $http, Upload, $location, $routeParams, ngDialog) {
    
    var query = {
        params: {
            single: false,
            appr: 1,
            list: $routeParams.list,
            page: $routeParams.page - 1
    }}
    
    if (query.params.list == "all") {
        query.params.list = null;
        $scope.pageHeading = "The latest ones";
    } else if (query.params.list == "user") {
        query.params.appr = 0;
        query.params.list = null;
        $scope.pageHeading = "Items for approve"
    } else {
        $scope.pageHeading = $routeParams.list + " for sale";
    }
    
    $http.get("api/data", query).success(function(data) {
        $scope.user = function() {
            if (data.user) {
                return true;
            }
        }
        $scope.data = data.data;
        $scope.totalCount = data.count;
        
        $scope.pageLimit = Math.ceil($scope.totalCount / 25);
        
        $scope.partCount = function() {
            var x = ($routeParams.page - 1)*25 + 1;
            if ($scope.totalCount < $routeParams.page*25) {
                y = $scope.totalCount;
            } else {
                y = $routeParams.page*25;
            }
            return "# " + x + " - " + y + " out of " + $scope.totalCount;
        }
        
    }).error(function() {
        if ($location.path() != "/list/user/" + $routeParams.page) $location.path("/list/all");
        $scope.totalCount = 0;
    });
    
    $scope.arrowHShow = function() {
        if ($routeParams.page*25 < $scope.totalCount) {
            return true;
        } else {
            return false;
        }
    }
    
    $scope.boxShow = function() {
        if ($routeParams.page == 1 && $scope.totalCount <= 25) {
            return true;
        } else {
            return false;
        }
    }

    $scope.delete = function (id){
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
                            url: 'api/delete',
                            method: 'POST',
                            data: {
                                'id': id
                            }
                        }).success(function () {
                            $scope.closeThisDialog();
                            $location.path("/");
                        })
                    } else {
                        $scope.closeThisDialog();
                    }
                }
            }]
        });

    };

    $scope.edit = function (id) {
        ngDialog.open({
            template: 'js/app/views/edit.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', '$location', function ($scope, $location) {
                $http({
                    url: "api/data/",
                    method: "GET",
                    params: {
                        single: true,
                        id: id
                    }
                }).success(function (data) {
                    $scope.item = data.data;
                    $scope.form = {
                        'title': data.data.title,
                        'category': data.data.category,
                        'description': data.data.description,
                        'price': data.data.price,
                        'name': data.data.name,
                        'city': data.data.city,
                        'phone': data.data.phone,
                        'img': data.data.img,
                        '_id': data.data._id
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

                $scope.send = function () {
                    $http({
                        url: 'api/update',
                        method: 'POST',
                        data: $scope.form
                    }).success(function (data) {
                        $scope.closeThisDialog();
                        $location.path('/');
                    })
                }

                $scope.cancel = function () {
                    $scope.closeThisDialog();
                }
            }]
        });
    }
    
    var n =  +$routeParams.page + 1;
    var p =  +$routeParams.page - 1;
    
    $scope.nextPage = function() {
        $location.path("/list/" + $routeParams.list + "/" + n);
    }
    
    $scope.previousPage = function() {
        if ($routeParams.page != 1) $location.path("/list/" + $routeParams.list + "/" + p);
    }
    
    $scope.isHidden = function(){
        if ($routeParams.page == 1) {
            return true;
        } else {
            return false;
        }
    }
    
    $scope.pageNumber = $routeParams.page;
    
    $scope.goToPage = function(x) {
        if (x != 0 && x <= $scope.pageLimit) $location.path("/list/" + $routeParams.list + "/" + x);

    }

}]);

// ITEM PAGE CONTROLLER

app.controller('itemCTRL', ['$scope', '$http', '$routeParams', '$location', 'ngDialog', function ($scope, $http, $routeParams, $location, ngDialog) {
    
    var query = {
        params: {
            single: true,
            id: $routeParams.id
    }}
    
    $http.get("api/data", query)
        .success(function(data) {
            $scope.user = function() {
            if (data.user && data.data.approved == 0) {
                return true;
            }
        }
            $scope.item = data.data;
            console.log($scope.item.img);
        }).error(function() {
            $location.path("/list/all");
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
                            $location.path('/user');
                        })
                    } else {
                        $scope.closeThisDialog();
                    }
                }
            }]
        });
    }

    $scope.delete = function (id) {
        ngDialog.open({
            template: 'js/app/views/confirm.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            controller: ['$scope', function ($scope) {
                $scope.message = "Reject?";
                $scope.dosmth = function (x) {
                    if (x == 'yes') {
                        $http({
                            url: 'api/delete',
                            method: 'POST',
                            data: {
                                'id': id
                            }
                        }).success(function () {
                            $scope.closeThisDialog();
                            $location.path('/user');
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

app.controller('newCTRL', ['$scope', '$http', '$location', 'Upload', function ($scope, $http, $location, Upload) {
    
    // $scope.onFileSelect = function($files) {
    //     alert("Image is selected!");
    //     var file = $files[0];
    //     //alert(file.type);
    //     if (file.type.indexOf('image') == -1) { $scope.error = 'Please choose a JPEG or PNG file.' }
    //     if (file.size > 2097152) { $scope.error = 'File size cannot exceed 2 MB.'; }
    //     $scope.upload = function() {
    //         $upload.upload({
    //             url: 'api/data',
    //             headers: { 'Content-Type': file.type },
    //             method: 'POST',
    //             data: $scope.form,
    //             file: file
    //         }).success(function(data) {
    //             $location.path('/');
    //         });
    //     }
    // };
    
    // $scope.submit = function() {
    //     return $scope.upload();
    // }
    
    //     $scope.$watch('files', function () {
    //     $scope.upload($scope.files);
    // });
    // $scope.log = '';
    
    $scope.submit = function() {
        return $scope.upload($scope.files);
    }

    // $scope.upload = function (files) {
    //     if (files && files.length) {
    //         // for (var i = 0; i < files.length; i++) {
    //         //     var file = files[i];
    //             Upload.upload({
    //                 url: 'api/data',
    //                 fields:  $scope.form,
    //                 file: file
    //             }).success(function () {
    //                 $location.path('/');
    //             });
    //         //}
    //     }
    // };
    
    $scope.upload = function (files) {
        var links = [];
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var rando = Math.random().toString(36).slice(2);
                var link = "https://tori.blob.core.windows.net/images/" + rando;
                links.push(link);
                Upload.upload({
                    url: 'api/image',
                    fields:  {rando},
                    file: file
                }).success(function () {
                    //$location.path('/');
                });
            }
        }
        
        $scope.form.img = links;
        console.log(links);
        
        $http.post('/api/data', $scope.form).
            success(function(data) {
                $location.path('/');
        })
    };

}]);

// SIGN IN POP-UP WINDOW CONTROLLER

app.controller('signinCTRL', ['$scope', '$http', '$location', '$window', 'ngDialog', 'vcRecaptchaService', function($scope, $http, $location, $window, ngDialog, vcRecaptchaService){
    
    $scope.response = null;
    $scope.widgetId = null;
    
    $scope.model = {
        key: '6Leo6AUTAAAAAF2YQmj0nlMRmpVuqMH_pTh0-_5P'
    };
    
    $scope.setResponse = function (response) {
        console.info('Response available');
        $scope.form.response = response;
    };
    
    $scope.setWidgetId = function (widgetId) {
        console.info('Created widget ID: %s', widgetId);
        $scope.widgetId = widgetId;
    };
    
    $scope.errorMessage = null;
    
    $scope.submit = function () {
        $http.post('/api/signin', $scope.form).
            success(function(data) {
                $scope.closeThisDialog();
                location.reload();
            }).error(function(err) {
                $scope.errorMessage = "Invalid credentials or/and you are a robot!";
                vcRecaptchaService.reload($scope.widgetId);
            });
    };

}]);