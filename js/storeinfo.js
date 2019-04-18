// Instantiate the myApp Angular application that we attached to out html tag
var app = angular.module("myApp", []);

// Here is the Javascript for our controller which we linked (scoped) to the body tag
app.controller("mainController", ['$scope','$http',function($scope, $http) {

    // Pulls user's settings in the DB on load
    $http({
        url: '/store/myinfo',
        method: "POST",
    })
        .then(function(response) {
                // success
                console.log(response);
            },
            function(response) {
                // failed
                alert("Something went wrong getting your store information");
                console.log(response);
            });

}]);
