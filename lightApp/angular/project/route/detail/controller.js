function DetailController($scope, $routeParams, messages) {
    $scope.message = messages[$routeParams.id];
}