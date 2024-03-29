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
  function ($rootScope, $scope, $http, $state, Bots, Session) {
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
      Bots.delete({
        userId: Session.userId,
        botId: Session.currentBot._id
      }, function (result) {
        _.remove($rootScope.bots, currentBot);
        if ($rootScope.bots.length > 0) Session.setCurrentBot($rootScope.bots[0]);
        console.log('Deletion result: ' + result);
      });
    };
  }
);


/**
 * Bots Create controller
 *
 */
hubotAppControllers.controller('BotsCreateCtrl',
  function ($rootScope, $scope, $http, Bots, Session) {
    $scope.newbot = new Bots();

    $scope.createBot = function (newbot) {
      Bots.save({ userId: Session.userId }, newbot, function (result) {
        $rootScope.bots.push(newbot);
      });
      $scope.newbot = new Bots();
    };
  }
);


hubotAppControllers.controller('AccountCtrl',
  function ($rootScope, $scope, Session) {
    $scope.userId = Session.userId;
    $scope.username = Session.username;
  }
);
