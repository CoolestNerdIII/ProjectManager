angular.module('project_manager', [
        'ngRoute',
        'ui.router',
        'ngResource',
        'project_manager.services',
        'project_manager.controllers',
        'ngMessages',
        'ngAnimate',
        'ngMaterial',
        'ngMdIcons',
        'dndLists',
        'md.data.table',
        'btford.socket-io'
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
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl'
            })
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
            .state('sprints', {
                abstract: true,
                url: '/sprints',
                template: '<ui-view/>'
            })
            .state('sprints.list', {
                url: '/list',
                templateUrl: 'partials/sprints.list.html',
                controller: 'sprintListCtrl'
            })
            .state('sprints.view', {
                url: '/view',
                templateUrl: 'partials/sprints.view.html',
                controller: 'sprintViewCtrl',
                params: {sprintId: null}
            })
            .state('chat', {
                url: '/chat',
                templateUrl: 'partials/chat.html',
                controller: 'chatCtrl'
            })
    })

    // Configure theme using Material
    .config(['$mdThemingProvider', function ($mdThemingProvider) {
        'use strict';

        $mdThemingProvider.theme('default')
            .primaryPalette('blue');
    }]);
