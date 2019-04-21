$(document).ready(function(){
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

        } else {
            return true;
        }
    }

    $("#test").click(function(){
        validateInput();
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
