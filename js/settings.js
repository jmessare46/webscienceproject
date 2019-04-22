// Instantiate the myApp Angular application that we attached to out html tag
var app = angular.module("settingsApp", []);

// Here is the Javascript for our controller which we linked (scoped) to the body tag
app.controller("mainController", ['$scope','$http',function($scope, $http) {

    // Pulls user's settings in the DB on load
    $http({
        url: '/user/myinfo',
        method: "POST",
    })
        .then(function(response) {
                // success
                $('#username').val(response.data.userdata.username);
                $('#email').val(response.data.userdata.email);
                $('#otheremail').val(response.data.userdata.email);
                $('#firstname').val(response.data.userdata.first_name);
                $('#lastname').val(response.data.userdata.last_name);
                $('#restrictions').val(response.data.userdata.diet);
                $scope.fav = response.data.userdata.favorite_store;
            },
            function(response) {
                // failed
                alert("Something went wrong getting your profile settings");
                console.log(response);
            });

    $http.get("/shops")
    .then(
      function(response)
      {
        $scope.shops = [];
        response.data["data"].forEach((element)=>
        {
          $scope.shops.push({"name":element.name, "_id":element._id});
        });
      },
      function(err)
      {
        alert("Something went wrong getting a list of all the shops");
      }
    );
}]);
