"use strict";

var MyApp = angular.module("MyApp", ["ngRoute", "ngAnimate", "ui.bootstrap", "btford.socket-io"])

/** ---------------------------------------------
 * Routes
 */
.config(["$routeProvider", "$locationProvider",
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
])


/** ---------------------------------------------
 * Socket
 */
.factory('mySocket', ["socketFactory", function (socketFactory) {
  return socketFactory();
}]);


/** ---------------------------------------------
 * Home Controller
 */
.controller("homeCtrl", ["$scope", "$routeProvider",
  function ($scope, $routeProvider) {
    
  }
])

/** ---------------------------------------------
 * Instance Controller
 */
.controller("instanceCtrl", ["$scope", "$routeProvider", "mySocket"
  function ($scope, $routeProvider, mySocket) {

  }
]);