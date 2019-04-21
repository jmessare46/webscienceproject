

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




$(document).ready(function(){

      $( "#question" ).change(function() {
        $("#question").css('color', '#495057');
      });

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


      

      // Validate input fields
      function validateInput() {
        if ($("#firstname").val()=="") {

          alert("Please enter a first name.");
          return false;

        } else if ($("#lastname").val()=="") {

          alert("Please enter a last name.");
          return false;


        } else if ($("#user").val()=="") {

          alert("Please enter a username.");
          return false;

        } else if ($("#email").val()=="") {

          alert("Please enter an email address.");
          return false;


        } else if ($("#password").val()=="") {

          alert("Please enter a password.");
          return false;

        } else if ($("#password").val()!=($("#confirm_password")).val()) {

          alert("Passwords do not match.");
          return false;

        } else if ($("#question:selected").val()=="Choose...") {

          alert("Please enter a security question.");
          return false;

        } else if ($("#answer").val()!=($("#answer2")).val()) {

          alert("Question answers are different.");
          return false;

        }

        else {
          return true;
        }
      }


    });
