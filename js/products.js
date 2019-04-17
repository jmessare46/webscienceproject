// Instantiate the myApp Angular application that we attached to out html tag
var app = angular.module("myApp", []);

// Here is the Javascript for our controller which we linked (scoped) to the body tag
app.controller("mainController", ['$scope','$http',function($scope, $http) {

    // Lets setup some variables for our expressions
    $scope.navbar = "navigation.html";
    $scope.sidebar = "sidebar.html";

    // Table for searching
    $http.get("/products")
    .then(
    function(res)
    {
      // Grab table data
      let all_products = res.data["data"];
      $http.get("/shops")
      .then(
      function(res)
      {
        let all_shops = res.data["data"];
        let shop_dict = {};
        all_shops.forEach((e)=>
        {
          shop_dict[e["_id"]] = e;
        });
        let tabledata = [];
        all_products.forEach((e, i)=>
        {
          tabledata.push(
          {
            "id":i,
            "name":e["name"],
            "price":e["price"],
            "store":shop_dict[e["store"]]["name"]
          });
        });
        // Generate table
        var table = new Tabulator("#search", {
          data:tabledata,
          layout:"fitColumns",      //fit columns to width of table
          responsiveLayout:"hide",  //hide columns that dont fit on the table
          tooltips:true,            //show tool tips on cells
          history:true,             //allow undo and redo actions on the table
          pagination:"local",       //paginate the data
          paginationSize:15,         //allow 7 rows per page of data
          initialSort:[             //set the initial sort order of the data
            {column:"name", dir:"asc"},
          ],
          columns:[                 //define the table columns
            {title:"Product", field:"name"},
            {title:"Price", field:"price"},
            {title:"Store", field:"store"},
          ]
        });

        //Search functionality
        $("#by").change(()=>
        {
          table.setFilter($("#by").val(), "like", $("#search_bar").val());
        });
        $("#search_bar").keyup(()=>
        {
          table.setFilter($("#by").val(), "like", $("#search_bar").val());
        });
      });
    });
}]);
