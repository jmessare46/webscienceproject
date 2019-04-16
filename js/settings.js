// Instantiate the myApp Angular application that we attached to out html tag
var app = angular.module("settingsApp", []);

// Here is the Javascript for our controller which we linked (scoped) to the body tag
app.controller("mainController", ['$scope','$http',function($scope, $http) {

    // Pulls user's settings in the DB on load
    $http({
        url: '/user/info',
        method: "POST",
        data: {
            email: "fake"
        }
    })
        .then(function(response) {
                // success
                console.log(response);
                $('#username').val(response.data.userdata.username);
                $('#email').val(response.data.userdata.email);
                $('#firstname').val(response.data.userdata.first_name);
                $('#lastname').val(response.data.userdata.last_name);
            //    TODO: Pull favorites and dietary restrictions here and populate them
            },
            function(response) {
                // failed
                alert("Something went wrong getting your profile settings");
                console.log(response);
            });

}]);
