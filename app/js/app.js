'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ui.router', 'ActiveStack'])

    .config(function($stateProvider,$rootScopeProvider, $sceProvider){

        Q.longStackSupport = true;
        $sceProvider.enabled(false);
        $stateProvider
        /**
         * Generic App Routes
         */
            .state('login', {
                url: "/login", // root route
                templateUrl: "templates/login.html"
            })
            .state('apps', {
                url: "/apps",
                abstract: true,
                templateUrl: "templates/apps.html",
                controller: "AppsController"
            })

        /**
         * Dashboard Routes
         */
            .state('apps.dashboard', {
                url: "/dashboard",
                templateUrl: "templates/dashboard/dashboard.html",
                data: {
                    name: "Dashboard"
                }
            })
    }
);
