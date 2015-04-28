function itemCTRL($scope, $routeParams, $rootScope, $location, $http, $document, $route, ngDialog, data, directiveService) {
    
    var el = angular.element(document.getElementById('rc'));
    directiveService.publish("This is a test.");

    $scope.item = data.data;
    $rootScope.weareon = data.data.category;
    console.log($scope.item)
    $scope.user = function() {
        if (data.user && data.data.approved == 0) {
            return true;
        }
    }
    
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
                            $location.path('/user/1');
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
                            $location.path('/user/1');
                        })
                    } else {
                        $scope.closeThisDialog();
                    }
                }
            }]
        });
    }
}

itemCTRL.resolve = {
    data : function($q, $route, $http, $location) {
        var deferred = $q.defer();
            
        var query = {
            params: {
                single: true,
                id: $route.current.params.id
        }}
        
        $http.get("api/data", query)
            .success(function(data) {
                deferred.resolve(data);
            }).error(function(data){
                $location.path("/list/all/1");
            });

        return deferred.promise;
    }
};