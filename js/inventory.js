const app = angular.module("myApp", []);
var data = [];

function displayItem()
{
  let id = $("#item").val();
  if ($("#item").val() != "")
  {
    for (let i = 0; i < data.length; i++)
    {
      if (data[i]._id == id)
      {
        $("#itemprice").val(data[i].price);
        $("#itemdescription").val(data[i].description);
        $("#results").removeClass("d-none");
        $("#rm").removeClass("d-none");
        break;
      }
    }
  }
  else
  {
    $("#results").addClass("d-none");
    $("#rm").addClass("d-none");
  }
}

app.controller('mainController', ['$scope','$http',($scope, $http)=>
{

    // Loads all of the store's items into the select
    $scope.refresh = function()
    {
        $http.get('/store/products').then(
        function (response) {
            data = response.data.products;

            $('#item').empty();
            $('#item').append("<option value=''>Choose...</option>");

            for(var x = 0; x < response.data.products.length; x++)
            {
                $('#item').append("<option value='" + response.data.products[x]._id + "'>" +
                    response.data.products[x].name + "</option>");
            }
        });
    };

    $scope.refresh();

    $scope.remove = function()
    {
      if (($("option:checked")[0].innerHTML != "Choose...") && ($("#item").val() != ""))
      {
        $http.post("/product/remove", {"name":$("option:checked")[0].innerHTML, "_id":$("#item").val()})
        .then(
        function(response)
        {
          alert(response.data.message);
          $scope.refresh();
          $("#results").addClass("d-none");
          $("#rm").addClass("d-none");
        },
        function(err)
        {
          alert(err.data.message);
        });
      }
    };

    $scope.update = function()
    {
      $http.post("/product/update", {"_id":$("#item").val(), "name":$("option:selected")[0].innerHTML, "price":$("#itemprice").val(), "description":$("#itemdescription").val()})
      .then(
      function(res)
      {
        alert(res.data.message);
      },
      function(err)
      {
        alert(err.data.message);
      });
    }
}]);

// Populates the price and description of an item
/*function selectitem(item)
{
    $('#itemprice').empty();
    $('#itemdescription').empty();

    if(item === "")
    {
        $('#results').css('display', 'none');
    }
    else
    {
        for(var x = 0; x < data.length; x++)
        {
            if(item === data[x]._id)
            {
                $('#itemprice').append(data[x].price);
                $('#itemdescription').append(data[x].description);
                $('#name').val(data[x].name);
                $('#id').val(data[x]._id);
            }
        }
        $('#results').css('display', 'block');
    }
}*/
