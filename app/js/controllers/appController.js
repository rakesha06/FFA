'use strict';

/* Controllers */
/* Defines the controllers module */
angular.module('myApp.controllers', ['ActiveStack']).
    /* Defines the main controller for the app.  Does authentication, etc */
    controller('AppController', ['$scope','$state','$rootScope','$log','$timeout','ActiveStack',
    function($scope, $state, $rootScope, $log, $timeout, ActiveStack) {

        $rootScope.VERSION = "0.0.1-SNAPSHOT"
        $scope.oauthProvider = ActiveStack.config.oauthProvider;
        $scope.anchorUser;
        $scope.connected = false;
        $scope.authenticating = false;

        $state.transitionTo("login");
        var autoLoginToState = null;
        var autoLoginToParams = null;
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

            if (toState.name != "login" && $scope.anchorUser == null) {
                $scope.authenticating = true;
                event.preventDefault(); // Stop the state transition
                autoLoginToState = toState.name;
                autoLoginToParams = toParams;
                ActiveStack.api.autoLogin()
                    .then(onLoginResult, function(err){
                        $log.error(err);
                        $scope.$apply(function(){
                            $scope.authenticating = false;
                        });
                    }, onAuthProgress
                ).fail(function(err){
                        $log.error(err.message);
                    });
            }
        });

        /**
         * Setup listeners for ActiveStack events
         */
        ActiveStack.api.on('connect', function() {
            $scope.$apply(function(){
                $scope.connected = true;
            });
        });
        ActiveStack.api.on('disconnect', function() {
            $scope.$apply(function(){
                $scope.authenticating = false;
                $scope.connected = false;
            });
        });

        var changedTimeoutId;
        ActiveStack.model.on('changed', function() {
            // The AngularJS preferred way of notifying it that the data model has changed is to use $timeout.
            if(!changedTimeoutId){
                changedTimeoutId = $timeout(function(){
                    changedTimeoutId = null;
                },0);
            }
        });

        /**
         * The only sure way to test if we are connected is to try to make a call
         * so we'll make a call to get the Person by ID... which should be the least
         * heavy.
         * @type {null}
         */
        var heartbeatPeriod = 15000;
        var heartbeatInterval = null;
        var heartbeatTimeout = null;
        var heartbeatThreshold = 6;
        var heartbeatFailures = 0;
        function heartbeat(){
            ActiveStack.api.findById("yes", $scope.anchorUser.ID, function(result){
                if(heartbeatTimeout){
                    $log.debug("Heartbeat...");
                    clearTimeout(heartbeatTimeout);
                    heartbeatTimeout = null;
                    heartbeatFailures = 0;
                }
            });

            heartbeatTimeout = setTimeout(function(){
                $log.debug("Heartbeat timout! ("+heartbeatFailures+")");
                heartbeatFailures++;
                if(heartbeatFailures > heartbeatThreshold){
                    $scope.logout();
                }
            }, heartbeatPeriod-1000)
        };

        /**
         * Handler function for autologin and login promise resolution
         * @param userToken
         */
        function onLoginResult(userToken){
            $log.debug("onLoginResult");
            if(!userToken){
                $scope.$apply(function(){
                    $scope.authenticating = false;
                    $scope.loginFailed = true;
                });
            }else{
                // Setup the heartbeat interval
                heartbeatInterval = setInterval(heartbeat, heartbeatPeriod);
                /**
                 * Successful auth... now pull down the person object so
                 * we know who we are
                 */
                $scope.message = "You're In!"
                var example = new ActiveStack.domain.User();
                example.userId = userToken.user.ID;
                ActiveStack.api.findByExample(example, function(message) {
                    var person = message.result[0];
                    $scope.$apply(function(){
                        // This also gets hit when the server sends down a person object
                        $scope.anchorUser = person;
                        ActiveStack.utils.anchorUser = person;
                        $scope.authenticating = false;
                        if(autoLoginToState)
                            $state.transitionTo(autoLoginToState, autoLoginToParams);
                        else
                            $state.transitionTo("apps.dashboard");

                    });
                });
            }
        }

        function onAuthProgress(progress){
            $log.debug("Got login progress: "+progress);
            switch(progress){
                case 1:
                    $scope.message = "Connecting to Data Server";
                    break;
                case 2:
                    $scope.message = "Authenticating User";
                    break;
                case 3:
                    $scope.message = "Fetching User Information";
                    break;
            }
            $scope.$apply();
        }

        /**
         * Click handler function for the "Login" button
         */
        $scope.message = "";
        $scope.authenticate = function(providerName, username, password) {
            $scope.message = "Logging in";
            $scope.authenticating = true;
            $scope.loginFailed = false;
            ActiveStack.api.authenticate(providerName, '{"username":"' + username + '", "password":"' + password + '"}')
                .then(
                onLoginResult,
                function(error){
                    $scope.$apply(function(){
                        $scope.authenticating = false;
                        $scope.loginFailed = true;
                    });
                },
                onAuthProgress
            ).done();
        }

        /**
         * Click handler function for the "logout" link
         */
        $scope.logout = function() {
            clearInterval(heartbeatInterval);
            ActiveStack.api.logout();
            window.location = "/";
        }
    }]
);
