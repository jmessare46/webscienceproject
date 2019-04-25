// Instantiate the myApp Angular application that we attached to out html tag
var app = angular.module("passwordApp", []);

// Here is the Javascript for our controller which we linked (scoped) to the body tag
app.controller("mainController", ['$scope','$http',function($scope, $http) {

}]);

$(document).ready(function(){

      $('#form').on('submit', function(e) {
          if (($("#answer").val())!=($("#conf_answer").val())) {
            e.preventDefault();
            alert("Answers don't match.");
          } else {
            alert("Security question changed!");
          }
         
      });
    });
