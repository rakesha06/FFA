'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppController', ['$scope', 'ActiveStack', function($scope, ActiveStack) {
		$scope.oauthProvider = ActiveStack.config.oauthProvider;
		$scope.anchorUser;
		$scope.connected = false;

		$scope.authenticate = function() {
			ActiveStack.api.on('connect', function() {
				$scope.$apply(function(){
					$scope.connected = true;
				});
			});
			ActiveStack.api.on('disconnect', function() {
				$scope.$apply(function(){
					$scope.connected = false;
				});
			});
			ActiveStack.api.on('anchorUser', function(evt){
				$scope.$apply(function(){
					$scope.anchorUser = evt.data;
				});
			})
			ActiveStack.api.model.on('changed', function() {
				$scope.$digest();
			});
			ActiveStack.api.authenticate();
		}
		
		$scope.logout = function() {
			ActiveStack.api.logout();
			$scope.anchorUser = null;
		}
  }]);
