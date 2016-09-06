'use strict';

angular.module('myApp.controllers').
    controller('AppsController',
    function($scope, $log, $state, ActiveStack){
        $scope.currentState = null;
        $scope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                $scope.currentState = toState;
            }
        );

        $scope.ActiveStack = ActiveStack;

        $scope.isActive = function(navName){
            var result = false;
            if($scope.currentState){
                if(navName == "Dashboard" && $scope.currentState.name.indexOf('apps.dashboard') == 0){
                    result = true;
                }
            }

            return result;
        }

    }
);
