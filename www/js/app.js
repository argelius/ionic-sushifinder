// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.

    state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    }).

    state('tab.find', {
      url: '/find',
      views: {
        'tab-find': {
          templateUrl: 'templates/tab-find.html',
          controller: 'FindCtrl'
        }
      }
    }).

    state('tab.favorites', {
      url: '/favorites',
      views: {
        'tab-favorites': {
          templateUrl: 'templates/tab-favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    }).

    state('tab.restaurants', {
      url: '/restaurants',
      views: {
        'tab-restaurants': {
          templateUrl: 'templates/tab-restaurants.html',
          controller: 'RestaurantsCtrl'
        }
      }
    }).

    state('tab.restaurant-details', {
      url: '/restaurants/:id',
      views: {
        'tab-restaurants': {
          templateUrl: 'templates/restaurant.html',
          controller: 'RestaurantCtrl'
        }
      }
    }).

    state('tab.restaurant-photos', {
      url: '/restaurants/:id/photos',
      views: {
        'tab-restaurants': {
          templateUrl: 'templates/restaurant-photos.html',
          controller: 'RestaurantPhotosCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/tab/find');

});

