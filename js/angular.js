// Instantiate the myApp Angular application that we attached to out html tag
var app = angular.module("myApp", []);

// Here is the Javascript for our controller which we linked (scoped) to the body tag
app.controller("mainController", ['$scope','$http',function($scope, $http) {

    // Lets setup some variables for our expressions
    $scope.navbar = "navigation.html";
    $scope.sidebar = "sidebar.html";
}]);

app.controller("listShops", ["$scope", "$http", function($scope, $http)
{
  $scope.stores = [];
  $scope.full_list;
  $http.post("/user/favorites").then(
  function(response)
  {
    $http.get("/shops").then(
    function(res)
    {
      let favorite_store_id = response.data["data"]["favorite_store"];
      let list = res.data["data"];
      let holder;
      list.forEach((e)=>
      {
        if (e["_id"] === favorite_store_id)
        {
          holder = e;
        }
      });
      list = list.filter((element)=>{ return element["_id"] !== favorite_store_id}); // remove favorite_store_id
      list.sort((a, b)=>{ return a["name"].localeCompare(b["name"]); });             // sort
      list.unshift(holder);                                                          // add it back to the front
      $scope.full_list = list;
      let i, j;
      // Split to 3 cards each
      for (i = j = 0; j <= list.length; j++)
      {
        if (j-i == 3)
        {
          $scope.stores.push(list.slice(i, j));
          i = j;
        }
      }
      if (i != j)
      {
        $scope.stores.push(list.slice(i, j));
      }
    },
    function(error)
    {
      console.log("error 2");
    });
  },
  function(err)
  {
    console.log("Error 1")
  });
  $scope.updateView = function( id )
  {
    $scope.focus = $scope.full_list.filter((ele)=>{ return ele["_id"] == id})[0];
  };
}]);