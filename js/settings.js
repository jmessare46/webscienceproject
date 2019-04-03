// Instantiate the myApp Angular application that we attached to out html tag
var app = angular.module("settingsApp", []);

// Here is the Javascript for our controller which we linked (scoped) to the body tag
app.controller("mainController", ['$scope','$http',function($scope, $http) {

    $http({
        url: '/user/info',
        method: "POST",
    })
        .then(function(response) {
                // success
                console.log(response.data.userdata);
                document.getElementById('username').value = response.data.userdata.username;
                document.getElementById('email').value = response.data.userdata.email;
                document.getElementById('firstname').value = response.data.userdata.first_name;
                document.getElementById('lastname').value = response.data.userdata.last_name;
            },
            function(response) { // optional
                // failed
                console.log(response);
            });

}]);
