$(document).ready(function(){

	


	$.ajax({
          type: "GET",
          url: "/user/isowner",
          async: true,
          success : function(data) {
            var IsOwner = data.is_owner;
            if (IsOwner==true) {
            	//alert("Is an owner!");
            	$(".customer_specific").css("display", "none");
            	$("#type").html("Vendor");
            } else {
            	//alert("Is not an owner!");
            	$(".vendor_specific").css("display", "none");
            	$("#type").html("Customer");

            }
            
          }
    });

    $.ajax({
          type: "POST",
          url: "/user/myinfo",
          async: true,
          success : function(data) {
            $("#username").html(data.userdata.first_name + " " + data.userdata.last_name);

          }
    });


});
