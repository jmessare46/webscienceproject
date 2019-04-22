const app = angular.module("myApp", []);
var data = null;

app.controller('mainController', ['$scope','$http',($scope, $http)=>
{

    // Loads all of the store's items into the select
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
        }
    );
}]);

// Populates the price and description of an item
function selectitem(item)
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
}
