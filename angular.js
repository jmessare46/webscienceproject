// Instantiate the myApp Angular application that we attached to out html tag
var app = angular.module("myApp", []);

// Here is the Javascript for our controller which we linked (scoped) to the body tag
app.controller("mainController", ['$scope','$http',function($scope, $http) {

    // Lets setup some variables for our expressions
    $scope.navbar = "navigation.html";
    $scope.sidebar = "sidebar.html";
}]);
