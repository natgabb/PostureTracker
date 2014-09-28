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


MyApp.directive('model', [function(){
  var ar = 0.1
    , s1r = 0.1
    , s2r = 0.1
    , s3r = 0.1
    , s4r = 0.1;

  return {
      restrict: "E",
      link: function(scope, element, attrs) {
          function display() {
            //create de scene
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            element[0].innerHTML = "";
            element[0].appendChild(renderer.domElement);

            //************************************************************
            //  Define colors
            //************************************************************
            var material_axis = new THREE.LineBasicMaterial({
              color: 0xFFFFFF
            });
            var material_sensor1 = new THREE.LineBasicMaterial({
              color: 0x0066FF
            });
            var material_sensor2 = new THREE.LineBasicMaterial({
              color: 0x00FF00
            });
            var material_sensor3 = new THREE.LineBasicMaterial({
              color: 0x0000FF
            });
            var material_sensor4 = new THREE.LineBasicMaterial({
              color: 0xFF0000 
            });
            //****************************** End: Define Colors


            //************************************************************
            //  Define geometries
            //************************************************************
            var geometry_axis = new THREE.Geometry();
            var geometry_sensor1 = new THREE.Geometry();
            var geometry_sensor2 = new THREE.Geometry();
            var geometry_sensor3 = new THREE.Geometry();
            var geometry_sensor4 = new THREE.Geometry();
            
            //Axis
            geometry_axis.vertices.push(
              new THREE.Vector3( 0.0, 0.0, 0.0 ),
              new THREE.Vector3( 0.0, 0.0, 2.0 )
            );
            geometry_axis.vertices.push(
              new THREE.Vector3( 0.0, 0.0, 0.0 )
              ,new THREE.Vector3( 0.0, 2.0, 0.0 )
            );
            geometry_axis.vertices.push(
              new THREE.Vector3( 0.0, 0.0, 0.0 )
              ,new THREE.Vector3( 2.0, 0.0, 0.0 )
            );

            var s0 = scope.data.payload.accels[0];
            var s1 = scope.data.payload.accels[1];
            var s2 = scope.data.payload.accels[2];
            var s3 = scope.data.payload.accels[3];

            //Sensor 1
            geometry_sensor1.vertices.push(
              new THREE.Vector3( 0.0, 0.0, 0.0 ),
              new THREE.Vector3( s0.x, s0.y, s0.z )
            );

            //Sensor 2
            geometry_sensor2.vertices.push(
              new THREE.Vector3( s0.x, s0.y, s0.z ),
              new THREE.Vector3( s1.x, s1.y, s1.z )
            );

            //Sensor 3
            geometry_sensor3.vertices.push(
              new THREE.Vector3( s1.x, s1.y, s1.z ),
              new THREE.Vector3( s2.x, s2.y, s2.z )
            );

            //Sensor 4
            geometry_sensor4.vertices.push(
              new THREE.Vector3( s2.x, s2.y, s2.z ),
              new THREE.Vector3( s3.x, s3.y, s3.z )
            );
            //****************************** End: Define geometries


            //************************************************************
            //  Rendering
            //************************************************************
            var line_axis = new THREE.Line( geometry_axis, material_axis );
            var line_sensor1 = new THREE.Line( geometry_sensor1, material_sensor1 );
            var line_sensor2 = new THREE.Line( geometry_sensor2, material_sensor2 );
            var line_sensor3 = new THREE.Line( geometry_sensor3, material_sensor3 );
            var line_sensor4 = new THREE.Line( geometry_sensor4, material_sensor4 );

            scene.add( line_axis );
            scene.add( line_sensor1 );
            scene.add( line_sensor2 );
            scene.add( line_sensor3 );
            scene.add( line_sensor4 );

            camera.position.z = 5;

            //Add camera tilt
            line_axis.rotation.x = 0.5;
            line_sensor1.rotation.x = 0.5;
            line_sensor2.rotation.x = 0.5;
            line_sensor3.rotation.x = 0.5;
            line_sensor4.rotation.x = 0.5;

            //render the scene
            var render = function () {
              requestAnimationFrame(render);

              //Add rotation
              ar = line_axis.rotation.y + 0.01;
              s1r = line_sensor1.rotation.y + 0.01;
              s2r = line_sensor2.rotation.y + 0.01;
              s3r = line_sensor3.rotation.y + 0.01;
              s4r = line_sensor4.rotation.y + 0.01;

              line_axis.rotation.y = ar;
              line_sensor1.rotation.y = s1r;
              line_sensor2.rotation.y = s2r;
              line_sensor3.rotation.y = s3r;
              line_sensor4.rotation.y = s4r;

              renderer.render(scene, camera);
            };
            render();
            //****************************** End: Rendering
          }

          scope.$watch(attrs.accela, function(accel1) {
            display();
          });
          scope.$watch(attrs.accelb, function(accel2) {
            display();
          });
          scope.$watch(attrs.accelc, function(accel3) {
            display();
          });
          scope.$watch(attrs.acceld, function(accel4) {
            display();
          });
          display();
      }
  };
}]);


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
    $scope.data = {};
    mySocket.on('broadcast', function(data) {
      data.payload = JSON.parse(data.payload);
      $scope.data = data;
    });
  }
]);