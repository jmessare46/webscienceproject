const app = angular.module("myApp", []);
app.controller('mainController', ['$scope','$http',($scope, $http)=>
{
    // Loads all of the store's items into the select
  $http.get('/store/products').then(
      function (response) {
          console.log(response.data.products);
          $('#item').empty();
          $('#item').append("<option value=''>Choose...</option>");

          for(var x = 0; x < response.data.products.length; x++)
          {
              $('#item').append("<option value='" + response.data.products[x]._id + "'>" +
                  response.data.products[x].name + "</option>");
          }
      }
  );
}]);
