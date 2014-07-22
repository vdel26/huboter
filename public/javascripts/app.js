'use strict';

var hubotApp = angular.module('hubotApp', [
  'ui.router',
  'ngResource',
  'ngCookies',
  'hubotApp.controllers',
  'hubotApp.services'
]);


var checkLoggedin = function($http, $q, $timeout, $state, Session) {
  var deferred = $q.defer();

  $http.get('/loggedin').success(function(user) {
    if (user !== '0') {
      Session.create(user.id, user.name);
      $timeout(deferred.resolve);
    }
    else {
      $timeout(deferred.reject);
      $state.go('login');
    }
  });

  return deferred.promise;
}


/**
 * Client-side router configuration
 */
hubotApp.config(function ($urlRouterProvider, $stateProvider, $httpProvider) {
  $httpProvider.responseInterceptors.push('httpInterceptor');

  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('bots', {
      url: '/bots',
      templateUrl: 'partials/bot-show',
      controller: 'BotsListCtrl',
      resolve: { loggedin: checkLoggedin }
    })
    .state('newbot', {
      url: '/bots/new',
      controller: 'BotsCreateCtrl',
      templateUrl: 'partials/bot-new',
      resolve: { loggedin: checkLoggedin }
    })
    .state('account', {
      url: '/account',
      templateUrl: 'partials/account',
      controller: 'AccountCtrl',
      resolve: { loggedin: checkLoggedin }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login',
      controller: 'AuthCtrl'
    });
});


/**
 * make state available from all scopes
 */
hubotApp.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }
);


/**
 * Handle login-required responses
 */
hubotApp.factory('httpInterceptor', function ($q, $window, $location) {
  return function (promise) {
    var success = function (response) {
      console.log('debug: authorized');
      return response
    };
    var error = function (response) {
      if (response.status === 401) {
        console.log('debug: not authorized');
        $location.url('/login'); // using $state.go() here creates circular dependency
      }

      return $q.reject(response);
    };

    return promise.then(success, error);
  }
});