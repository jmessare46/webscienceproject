app.controller('itemController', ['$scope','$http',($scope, $http)=>
{
  $scope.items=[
    {'name': 'Apple',
     'desc': 'A kind of fruit that is red and delicious',
     'code': 1234,
     'img': ''},
    {'name': 'Banana',
     'desc': 'A kind of fruit that is yellow and throwable',
     'code': 5678,
     'img': ''},
    {'name': 'Orange',
     'desc': 'The best fruit in the world',
     'code': 3456,
     'img': ''}];
}]);