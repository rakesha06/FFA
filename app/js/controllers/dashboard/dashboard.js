'use strict';

/* Controllers */

angular.module('myApp.controllers').
    controller('DashboardController',
    function($scope, $state, ActiveStack, $log) {

    	$scope.userAnchor = ActiveStack.utils.anchorUser;

    	$scope.handleClickAppointment = function(appt) {
    		debugger;
    	}
    });
