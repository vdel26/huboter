'use strict';

/* Services */
var hubotAppServices = angular.module('hubotApp.services', []);


hubotAppServices.factory('Auth', function ($http, Session, $state) {
  return {
    login: function (credentials) {
      return $http.post('/login', credentials);
    },
    logout: function () {
      $http.get('/logout')
        .success(function (data, status, headers, config) {
          Session.destroy();
          $state.go('login');
        })
        .error(function (data, status, headers, config) {
          console.log('Error: ' + status + '. ' + data);
        });
    }
  };
});


hubotAppServices.factory('Session', function ($rootScope) {
  return {
    userId: '',
    username: '',
    currentBot: '',
    create: function (userId, username) {
      this.userId = userId;
      this.username = username;
    },
    destroy: function () {
      this.userId = null;
      this.username = null;
      this.currentBot = null;
    },
    setCurrentBot: function (bot) {
      this.currentBot = bot;
      $rootScope.$broadcast('bot.change', bot);
    }
  };
});


/**
 * Bots API
 */
hubotAppServices.factory('Bots', function ($resource, Session) {
  var Bots = $resource('/:userId/bots/:botId', {},
  {
    query: {
      method:'GET',
      isArray: true,
      transformResponse: function(response) {
        return JSON.parse(response).bots;
      },
    },
    update: {
      method: 'PUT'
    }
  });

  return Bots;

});
