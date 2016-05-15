angular.module('todo-aholic.services', ['ngResource'])
    .factory('mySocket', function(socketFactory) {
        "use strict";
        return socketFactory();
    })
    .factory('Todos', function ($resource) {
        "use strict";
        return $resource('/api/todos/:id/', {}, {
            'update': {method: 'PUT'}
        });
    })
    .factory('Category', function ($resource) {
        "use strict";
        return $resource('/api/categories/:id/');
    })
    .factory('Item', function ($resource) {
        "use strict";
        return $resource('/api/items/:id/', {}, {
            'update': {method: 'PUT'}
        });
    })
    .factory('Sprint', function ($resource) {
        "use strict";
        return $resource('/api/sprints/:id/', {}, {
            'update': {method: 'PUT'}
        });
    })
    .factory('Room', function ($resource) {
        "use strict";
        return $resource('/api/rooms/:id/');
    });