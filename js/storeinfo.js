// Instantiate the myApp Angular application that we attached to out html tag
var app = angular.module("myApp", []);

// Here is the Javascript for our controller which we linked (scoped) to the body tag
app.controller("mainController", ['$scope','$http',function($scope, $http) {

    tinymce.init({
        selector: '.tinymce'
    });

    // Pulls user's settings in the DB on load
    $http({
        url: '/store/myinfo',
        method: "POST",
    })
        .then(function(response) {
                // success
                $scope.storedata = response.data.userdata;
                $("#storename").val($scope.storedata.name);
                $("#address").val($scope.storedata.address);
                $("#description").val($scope.storedata.description);
            },
            function(response) {
                // failed
                alert("Something went wrong getting your store information");
                console.log(response);
            });


    $scope.validate = function () {
        // TODO: Add form validation here
        return true;
    }

    $scope.update = function()
    {
        $http.post("/store/update",
        {
          "store_name":$("#storename").val(),
          "category":$("#category").val(),
          "address":$("#address").val(),
          "location":($("#oncampus").is(":checked") ? "on_campus":"off_campus"),
          "description":tinyMCE.activeEditor.getContent()
        }).then(
        function(res)
        {
          alert(res.data.message);
        },
        function(err)
        {
          alert("Error occurred when trying to update Shop information.");
        });
    }
}]);
