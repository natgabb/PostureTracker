"use strict";

var MyApp = angular.module("MyApp", ["ngRoute", "ngAnimate", "ui.bootstrap"]);

/**
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


/**
 * Home Controller
 */
MyApp.controller("homeCtrl", ["$scope", "$routeProvider",
  function ($scope, $routeProvider) {
    
  }
])

/**
 * Instance Controller
 */
.controller("instanceCtrl", ["$scope", "$routeProvider",
  function ($scope, $routeProvider) {

  }
]);