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
    CLIENT_ID = 'U3UTSAZEKJXLB3IZJWTZYQLWTLBQFKLVQ0XQDJPQDRKDII5X',
    CLIENT_SECRET = 'OR4PNP3SGP3TKGYVA5YIONVHM44OSEQ4LYQ2OLWVVVC3AHIB';

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

factory('Favorites', function($q, $window) {
  var favorites = angular.fromJson($window.localStorage.getItem('favorites') || '{}');

  return {
    get: function(id) {
      var deferred = $q.defer();
      
      if (favorites.hasOwnProperty(id)) {
        deferred.resolve(favorites[id]);
      } else {
        deferred.reject('Did not find favorite with that id');
      }

      return deferred.promise;
    },

    toggle: function(restaurant) {
      var deferred = $q.defer();

      var id = restaurant.id;

      if (favorites.hasOwnProperty(id)) {
        delete favorites[id];
        deferred.resolve(false);
      } else {
        favorites[id] = restaurant.name;
        deferred.resolve(true);
      }

      $window.localStorage.setItem('favorites', angular.toJson(favorites));

      return deferred.promise;
    },

    all: function() {
      var deferred = $q.defer();
      deferred.resolve(favorites);
      return deferred.promise;
    }
  }
});

