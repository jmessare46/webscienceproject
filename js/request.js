// Instantiate the myApp Angular application that we attached to out html tag
var app = angular.module("myApp", []);

// Here is the Javascript for our controller which we linked (scoped) to the body tag
app.controller("mainController", ['$scope','$http',function($scope, $http) {

    tinymce.init({
        selector: '#description'
    });
}]);


$(document).ready(function(){


$('#form').on('submit', function(e) {
	if (validateInput()==true) {
	  if (checkUserExists()==false) {
	    alert("User Created!");
	  } else {
	    alert("A user with the email: "+($("#email").val()) + " already exists.")
	    e.preventDefault();
	  }
	} else {
	  e.preventDefault();
	}

});

function checkUserExists() {

  var address = ($("#email").val());
  var exists = "Something went wrong";
    $.ajax({
          type: "POST",
          url: "/user/info",
          async: false,
          data: {
            "email": address
          },
          success : function(data) {
            if (data.message==undefined) {
              exists = true;
            } else {
              exists = false;
            }
          }
    });
  return exists;
}

// Validate input fields
function validateInput() {
	
	if ($("#desc").val()=="") {
		alert("You should enter a description for your store");
		return false;

	} else if ($("#pass").val()!=($("#pass2")).val()) {

	  alert("Passwords do not match.");
	  return false;

	}
	else if ($("#email").val()!=($("#email2")).val()) {

	  alert("Emails do not match.");
	  return false;

	}

	else {
	  return true;
	}
}
});
