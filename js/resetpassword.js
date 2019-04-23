$(document).ready(function(){
     $('#form').on('submit', function(e) {
          if (($("#password").val())!=($("#confpassword").val())) {
            e.preventDefault();
            alert("Passwords don't match.");
          } else {
            alert("Password changed!");
          }
         
      });
});

/*
 * Gets the security question of a given user's email.
 */
function getquestion()
{
    $.ajax({
        type: "POST",
        url: '/user/info',
        data: {
            email: $('#email').val()
        },
        success: function(response) {
            // success
            $('#question').val(response.userdata.question);
            $('#first').css('display', 'none');
            $('#second').css('display', 'block');
        },
        error: function(response) {
            // failed
            alert("Something went wrong getting the security question for the '" + email + "' account");
            console.log(response);
        }
    });
}

/*
 * Verify's that the user provided the correct answer to their security question.
 */
function verifyanswer()
{
    $.ajax({
        type: "POST",
        url: '/user/verifyanswer',
        data: {
            email: $('#email').val(),
            answer: $('#answer').val()
        },
        success: function(response) {
            if(response.correct_answer)
            {
                $('#third').css('display', 'block');
                $('#second').css('display', 'none');
            }
            else
            {
                alert("This answer is incorrect!");
            }
        },
        error: function(response) {
            // failed
            alert("Something went wrong verifying the answer to the security question");
            console.log(response);
        }
    });
}
