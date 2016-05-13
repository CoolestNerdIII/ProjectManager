angular.module('todoService', ['ngResource'])
    .factory('Todos', function($resource) {
        "use strict";
        return $resource('/api/todos/:id/', {}, {
            'update': { method: 'PUT'}
        });
    });