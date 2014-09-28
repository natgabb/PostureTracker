"use strict";

var MyApp = angular.module("MyApp", ["ngRoute", "ngAnimate", "ui.bootstrap", "btford.socket-io", "nvd3ChartDirectives", "angularMoment"]);

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
  var renderer = new THREE.WebGLRenderer();
  return {
      restrict: "E",
      link: function(scope, element, attrs) {
			var oldYRotation = 0.1;
          function display() {
            //create de scene
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
            
            renderer.setSize(400, 300);
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
            var geometry_axis = new THREE.Geometry()
              , geometry_sensor1 = new THREE.Geometry()
              , geometry_sensor2 = new THREE.Geometry()
              , geometry_sensor3 = new THREE.Geometry()
              , geometry_sensor4 = new THREE.Geometry();
            
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

            var s0 = scope.data.payload.accels[0]
              , s1 = scope.data.payload.accels[1]
              , s2 = scope.data.payload.accels[2]
              , s3 = scope.data.payload.accels[3];


            var startx = 0.0
              , starty = 0.0
              , startz = 0.0
              , endx = parseFloat(s0.x)
              , endy = parseFloat(s0.y)
              , endz = parseFloat(s0.z);

            //Sensor 1
            geometry_sensor1.vertices.push(
              new THREE.Vector3( -startx, -starty, startz ).multiplyScalar(0.3),
              new THREE.Vector3( -endx, -endy, endz ).multiplyScalar(0.3)
            );
            startx = parseFloat(endx);
            starty = parseFloat(endy);
            startz = parseFloat(endz);
            endx += parseFloat(s1.x);
            endy += parseFloat(s1.y);
            endz += parseFloat(s1.z);

            //Sensor 2
            geometry_sensor2.vertices.push(
              new THREE.Vector3( -startx, -starty, startz ).multiplyScalar(0.3),
              new THREE.Vector3( -endx, -endy, endz ).multiplyScalar(0.3)
            );
            startx = parseFloat(endx);
            starty = parseFloat(endy);
            startz = parseFloat(endz);
            endx += parseFloat(s1.x);
            endy += parseFloat(s1.y);
            endz += parseFloat(s1.z);

            //Sensor 3
            geometry_sensor3.vertices.push(
              new THREE.Vector3( -startx, -starty, startz ).multiplyScalar(0.3),
              new THREE.Vector3( -endx, -endy, endz ).multiplyScalar(0.3)
            );
            startx = parseFloat(endx);
            starty = parseFloat(endy);
            startz = parseFloat(endz);
            endx += parseFloat(s1.x);
            endy += parseFloat(s1.y);
            endz += parseFloat(s1.z);

            //Sensor 4
            geometry_sensor4.vertices.push(
              new THREE.Vector3( -startx, -starty, startz ).multiplyScalar(0.3),
              new THREE.Vector3( -endx, -endy, endz ).multiplyScalar(0.3)
            );
            //****************************** End: Define geometries


            //************************************************************
            //  Rendering
            //************************************************************
            var line_axis = new THREE.Line( geometry_axis, material_axis )
              , line_sensor1 = new THREE.Line( geometry_sensor1, material_sensor1 )
              , line_sensor2 = new THREE.Line( geometry_sensor2, material_sensor2 )
              , line_sensor3 = new THREE.Line( geometry_sensor3, material_sensor3 )
              , line_sensor4 = new THREE.Line( geometry_sensor4, material_sensor4 );

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
			
            //Sets the Y rotation to the previous vector's rotation
            line_axis.rotation.y = oldYRotation;
            line_sensor1.rotation.y = oldYRotation;
            line_sensor2.rotation.y = oldYRotation;
            line_sensor3.rotation.y = oldYRotation;
            line_sensor4.rotation.y = oldYRotation;

            //render the scene
            var render = function () {
              requestAnimationFrame(render);

              //Add rotation
              line_axis.rotation.y +=0.01;
              line_sensor1.rotation.y +=0.01;
              line_sensor2.rotation.y +=0.01;
              line_sensor3.rotation.y +=0.01;
              line_sensor4.rotation.y +=0.01;
			        oldYRotation = line_axis.rotation.y;
			  
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
    $scope.exampleData = [{
        "key": "Series 1",
        "values": []
    }];
    $scope.average = function(){
      var ratings = $scope.exampleData[0]["values"];
      if (ratings.length) {
        var sum = 0;
        for(var i=0; i < ratings.length; ++i) {
          sum += parseFloat(ratings[i][1]);
        }
        return Math.round(sum / ratings.length);
      }
    };

    $scope.xAxisTickFormatFunction = function(){
        return function(d){
            return d3.time.format('%Hh %Mm %Ss')(moment.unix(d).toDate());
        }
    };

    mySocket.on('broadcast', function(data) {
      data.payload = JSON.parse(data.payload);
      $scope.data = data;

      // update graph
      var rating = data.payload.rating;
      var timeline = moment().unix();
      $scope.exampleData[0]["values"].push([ timeline, rating ]);
      nv.graphs[0].update();
    });
  }
]);