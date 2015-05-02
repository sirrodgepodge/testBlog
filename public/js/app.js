(function() {
    var app = angular.module('bawss', []);

    app.controller('BlogCtrl', ['$scope', function($scope){
	    $scope.articles = articles;
	}]);
})();