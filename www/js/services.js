angular.module('starter.services', []).

factory('$geolocation', function($q) {
  return {
    get: function() {
      var deferred = $q.defer();
 
      navigator.geolocation.getCurrentPosition(
        function(result) {
          deferred.resolve(result);
        },
        function(error) {
          deferred.reject(error);
        }
      );
 
      return deferred.promise;          
    },
 
    watch: function() {
      var deferred = $q.defer();
 
      navigator.geolocation.watchPosition(
        function(result) {
          deferred.notify(result);
        },
        function(error) {
          deferred.reject(error);
        }
      );
 
      return deferred.promise;
    }
  };
}).

factory('$foursquare', function($q, $http) {
  var API_ROOT = 'https://api.foursquare.com/v2/venues/',
    CLIENT_ID = '3AQ4HIAWSX01HES220AHR11EJVOX05V4OW34I14BXYLHMGMX',
    CLIENT_SECRET = '4HOGLN2IXK4PCMKIF10GEKMUEZU00G5M1B5NK0C4VGL0ITGO';

  return {
    search: function(position, query) {
      var deferred = $q.defer(),
        params = {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          v: '20130815',
          ll: position.latitude + ',' + position.longitude,
          query: query,
          callback: 'JSON_CALLBACK' 
        };

      $http({
        url: API_ROOT + 'search',
        method: 'JSONP',
        params: params
      }).success(function(data) {
        if (data.meta.code !== 200) {
          deferred.reject(data.meta.errorDetail);
        } else { 
          deferred.resolve(data.response.venues);
        }
      }).error(function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    },

    get: function(id) {
      var deferred = $q.defer(),
        params = {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          v: '20130815',
          callback: 'JSON_CALLBACK'
        };

      $http({
        url: API_ROOT + id,
        method: 'JSONP',
        params: params
      }).success(function(data) {
        if (data.meta.code !== 200) {
          deferred.reject(data.meta.errorDetail);
        } else {
          deferred.resolve(data.response.venue);
        }
      }).error(function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }
  }
}).

factory('Favorites', function($window) {
  var favorites = angular.fromJson($window.localStorage.getItem('favorites') || '{}');

  return {
    get: function(id) {
      return favorites[id];
    },

    toggle: function(restaurant) {
      var id = restaurant.id;

      if (favorites.hasOwnProperty(id)) {
        delete favorites[id];
      } else {
        favorites[id] = restaurant.name;
      }

      $window.localStorage.setItem('favorites', angular.toJson(favorites));
    },

    all: function() {
      return favorites;
    }
  }
});
