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
 * Bots List controller
 *
 */
hubotAppControllers.controller('BotsListCtrl',
  function ($rootScope, $scope, $http, Bots, Session) {
    Bots.query({ userId: Session.userId }, function (bots) {
      $rootScope.bots = bots;
      Session.setCurrentBot(bots[0]); // fix: only do this when controller first instantiated
    });

    $scope.isLocked = true;

    $scope.toggleEditing = function (currentBot) {
      if (!$scope.isLocked && !$scope.BotInfo.$pristine) {
        Bots.update({
          userId: Session.userId,
          botId: Session.currentBot._id
        }, currentBot, function (result) {
          console.log(result);
        });
      }
      $scope.isLocked = !$scope.isLocked;
    };

    $scope.deleteBot = function (currentBot) {
      // delete bot
      console.log('deleting bot: ' + currentBot.name)
    };
  }
);


/**
 * Bots Create controller
 *
 */
hubotAppControllers.controller('BotsCreateCtrl',
  function ($rootScope, $scope, $http, Bots, Session) {

    $scope.createBot = function () {
      var data = JSON.stringify($scope.newbot);
      console.log('Bot info: ' + data);
    };
  }
);


hubotAppControllers.controller('AccountCtrl',
  function ($rootScope, $scope, Session) {
    $scope.userId = Session.userId;
    $scope.username = Session.username;
  }
);
