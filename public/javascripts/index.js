"use strict";

var MyApp = angular.module("MyApp", ["ngRoute", "ngAnimate", "ui.bootstrap", "btford.socket-io"]);

/** ---------------------------------------------
 * Routes
 */
MyApp.config(["$routeProvider", "$locationProvider",
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "partials/home.html",
        controller: "homeCtrl"
      })
      .when("/:id", {
        templateUrl: "partials/instance.html",
        controller: "instanceCtrl"
      })
      .otherwise({
        redirectTo: "/"
      });

    $locationProvider.html5Mode(true);
  }
]);


/** ---------------------------------------------
 * Socket
 */
MyApp.factory('mySocket', ["socketFactory", function (socketFactory) {
  return socketFactory();
}]);


/** ---------------------------------------------
 * Home Controller
 */
MyApp.controller("homeCtrl", ["$scope",
  function ($scope) {
    
  }
]);

/** ---------------------------------------------
 * Instance Controller
 */
MyApp.controller("instanceCtrl", ["$scope", "mySocket",
  function ($scope, mySocket) {
    $scope.messages = [];
    mySocket.emit('message', "Gab", "Testing testing 12 12");
    mySocket.on('broadcast', function(data) {
      $scope.messages.push(data);
    });
  }
]);