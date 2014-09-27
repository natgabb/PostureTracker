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
    mySocket.emit('message', "Gab", JSON.stringify({ 
      sensor1: { x: 1.0, y: 1.0, z: 1.0},
      sensor2: { x: 2.0, y: 5.0, z: 2.0},
      sensor3: { x: 3.0, y: 6.0, z: 3.0},
      sensor4: { x: 4.0, y: 7.0, z: 4.0}
    }));
    mySocket.on('broadcast', function(data) {
      data.payload = JSON.parse(data.payload);
      $scope.messages.push(data);
    });
  }
]);