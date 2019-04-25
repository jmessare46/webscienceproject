const app = angular.module("myApp", []);
var data = [];

// Display a specific product based on the select ag
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
            $("#results").addClass("d-none");
            $("#rm").addClass("d-none");

            for(var x = 0; x < response.data.products.length; x++)
            {
                $('#item').append("<option value='" + response.data.products[x]._id + "'>" +
                    response.data.products[x].name + "</option>");
            }
        });
    };

    $scope.refresh();

    // Remove a product
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

    // Update a product
    $scope.update = function()
    {
      $http.post("/product/update", {"_id":$("#item").val(), "name":$("option:selected")[0].innerHTML, "price":$("#itemprice").val(), "description":$("#itemdescription").val()})
      .then(
      function(res)
      {
        alert(res.data.message);
        $scope.refresh();
      },
      function(err)
      {
        alert(err.data.message);
      });
    };

    // Add a product
    $scope.add = function()
    {
      $http.post("/product/add", {"name":$("#iName").val(), "price":$("#price").val(), "description":$("#desc").val()})
      .then(
      function(res)
      {
        alert(res.data.message);
        $scope.refresh();
      },
      function(err)
      {
        alert(err.data.message);
      });
    }
}]);
