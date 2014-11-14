angular.module('starter.controllers', [])

.controller('FindCtrl', function($scope, $q, $geolocation, $foursquare, $window) {
  $scope.findRestaurants = function() {
    var deferred = $q.defer();

    $geolocation.get().then(
    function(position) {
      $foursquare.search(position.coords, 'sushi').then(
      function(result) {
        deferred.resolve(result);
      },
      function(error) {
        deferred.reject(error);
      });
    }, 
    function(error) {
      deferred.reject(error);
    });

    deferred.promise.then(function(restaurants) {
      $scope.restaurants = restaurants;
    },
    function(error) {
      $window.alert('Search failed: ' + error);
    });
  };

  $scope.findRestaurants();
})

.controller('RestaurantCtrl', function($scope, $stateParams, $foursquare, $window, Favorites) {
  $foursquare.get($stateParams.id).then(
  function(restaurant) {
    console.log(restaurant);
    $scope.restaurant = restaurant;
  },
  function(error) {
    $window.alert('Unable to find restaurant: ' + error);
  });

  $scope.isFavorite = function(restaurant) {
    
    return (restaurant && typeof Favorites.get(restaurant.id) !== 'undefined');
  };

  $scope.toggleFavorite = function(restaurant) {
    Favorites.toggle(restaurant);
  };
})

.controller('FavoritesCtrl', function($scope, Favorites) {
  $scope.restaurants = Favorites.all(); 
  console.log($scope.restaurants);
})

.filter('distance', function() {
  return function(meters) {
    meters = parseInt(meters);

    if (meters < 500) {
      return meters + 'm';
    } else {
      return (meters/1000).toString().substr(0,3) + 'km';
    }
  };
});
