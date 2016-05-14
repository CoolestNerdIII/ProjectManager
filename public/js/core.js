// js/core.js

angular.module('todo-aholic', [
        'ngRoute',
        'ui.router',
        'ngResource',
        'todo-aholic.services',
        'todo-aholic.controllers',
        'ngMessages',
        'ngAnimate',
        'ngMaterial',
        'ngMdIcons'
    ])
    .config(function ($httpProvider, $resourceProvider, $locationProvider, $urlMatcherFactoryProvider) {
        "use strict";

        // CSRF Support
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

        $urlMatcherFactoryProvider.strictMode(false);

        // user the HTML5 History API for removing hashtag
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

    })
    .config(function ($stateProvider, $urlRouterProvider) {
        "use strict";
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'partials/home.html',
                controller: 'mainController'
            })
            .state('backlog', {
                url: '/backlog',
                templateUrl: 'partials/backlog.html',
                controller: 'backlogController'
            })
    })

    // Configure theme using Material
    .config(['$mdThemingProvider', function ($mdThemingProvider) {
        'use strict';

        $mdThemingProvider.theme('default')
            .primaryPalette('blue');
    }]);
