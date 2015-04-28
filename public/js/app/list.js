function listCTRL($scope, $routeParams, $rootScope, $location, $http, $document, $route, ngDialog, data, directiveService) {
    
    $rootScope.weareon = $routeParams.list;
    
    var el = angular.element(document.getElementById('rc'));
    
    //directiveService.publish("TESTTESTTEST");

    $scope.data = data.data;
    $scope.user = function() {
        if (data.user) {
            return true;
        }
    }
    
    if ($routeParams.list == "all") {
        $scope.pageHeading = "The latest ones";
    } else if ($routeParams.list == "user") {
        $scope.pageHeading = "Items for approve"
    } else {
        $scope.pageHeading = $routeParams.list + " for sale";
    }
    
    if ($scope.data.length == 0 && $routeParams.list != "user") {
        $location.path("/list/1");
    }
    
    if ($scope.data.length != 0) {
        $scope.totalCount = data.count;
        
        $scope.pageLimit = Math.ceil($scope.totalCount / 25);
        
        $scope.partCount = function() {
            var x = ($routeParams.page - 1)*25 + 1;
            if ($scope.totalCount < $routeParams.page*25) {
                var y = $scope.totalCount;
            } else {
                var y = $routeParams.page*25;
            }
            return "# " + x + " - " + y + " out of " + $scope.totalCount;
        }
        
        $scope.arrowHShow = function() {
            if ($routeParams.page*25 > $scope.totalCount) {
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
                                $route.reload();
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
    
                    $scope.send = function () {
                        $http({
                            url: 'api/update',
                            method: 'POST',
                            data: $scope.form
                        }).success(function (data) {
                            $scope.closeThisDialog();
                            $route.reload();
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
            $document.duScrollToElementAnimated(el);
        }
        
        $scope.previousPage = function() {
            if ($routeParams.page != 1) $location.path("/list/" + $routeParams.list + "/" + p);
            $document.duScrollToElementAnimated(el);
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
            if (x != 0 && x <= $scope.pageLimit) 
            {
                $location.path("/list/" + $routeParams.list + "/" + x);
                $document.duScrollToElementAnimated(el);
            }
        }
    } else {
        
        $scope.partCount = function() {
            return "nothing to show"
        }
        
        $scope.boxShow = function() {
            return true
        }
    }

}

listCTRL.resolve = {
    data : function($q, $route, $http, $location) {
        var deferred = $q.defer();
            
        var query = {
            params: {
                single: false,
                appr: 1,
                list: $route.current.params.list,
                page: $route.current.params.page - 1
        }}
        
        if (query.params.list == "all") {
            query.params.list = null;
        } else if (query.params.list == "user") {
            query.params.appr = 0;
            query.params.list = null;
        }
        
        $http.get("api/data", query)
            .success(function(data) {
                deferred.resolve(data);
            }).error(function(data){
                $location.path("/list/all/1");
            });

        return deferred.promise;
    }
};