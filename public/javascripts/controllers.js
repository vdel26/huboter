'use strict';

/* Controllers */
var hubotAppControllers = angular.module('hubotApp.controllers', []);


/**
 * Top level controller
 *
 */
hubotAppControllers.controller('AppCtrl',
  function ($rootScope, $scope, $http, $state, Auth, Bots, Session) {

    $scope.isLogin = function () {
      return $state.is('login');
    };

    $scope.$on('bot.change', function (event, bot) {
      $rootScope.currentBot = bot;
    });

    $rootScope.setCurrentBot = function (bot) {
      Session.setCurrentBot(bot);
    };

    $scope.logout = Auth.logout;
  }
);


/**
 * Authentication controller
 *
 */
hubotAppControllers.controller('AuthCtrl',
  function ($rootScope, $scope, $state, Auth) {
    $scope.login = function () {
      var credentials = {
        username: this.username,
        password: this.password
      };
      Auth.login(credentials).success(function () {
        $state.go('bots'); // hack: first state so that currentBot is initialized
      });
    }
  }
);


/**
 * Bots controller
 *
 */
hubotAppControllers.controller('BotsCtrl',
  function ($rootScope, $scope, $http, Bots, Session) {
    Bots.query({ userId: Session.userId }, function (bots) {
      $rootScope.bots = bots;
      Session.setCurrentBot(bots[0]); // fix: only do this when controller first instantiated
    });

    // new bot
    $scope.newbot = 'newbot';
  }
);


hubotAppControllers.controller('AccountCtrl',
  function ($rootScope, $scope, Session) {
    $scope.userId = Session.userId;
    $scope.username = Session.username;
  }
);
