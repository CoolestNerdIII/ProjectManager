angular.module('todoController', [])
    .controller('mainController', function($scope, $http, Todos) {
        "use strict";
        $scope.formData = {};

        Todos.query(function(data) {
                $scope.todos = data;
        });

        $scope.createTodo = function() {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            // people can't just hold enter to keep adding the same to-do anymore
            if (!$.isEmptyObject($scope.formData)) {

                // call the create function from our service (returns a promise object)

                var newTodo = new Todos($scope.formData);
                newTodo.$save(function(data) {
                    $scope.formData = {} ;
                    $scope.todos.push(data);
                    console.log(data);
                });
                // Todos.create($scope.formData)
                //
                //     // if successful creation, call our get function to get all the new todos
                //     .success(function(data) {
                //         $scope.formData = {}; // clear the form so our user is ready to enter another
                //         $scope.todos = data; // assign our new list of todos
                //     });
            }
        };

        $scope.markComplete = function(item) {
            item.done = !item.done;
            Todos.update({id: item._id}, item, function(resp) {
                console.log(resp);
            });
            // var item = Todos.get({id: id}, function() {
            //     console.log(item);
            //     item.done = !item.done;
            //     item.$save()
            // });
        };

        // delete a todo after checking it
        $scope.deleteTodo = function (id) {
            console.log(id);
            Todos.delete({id: id}, function(resp) {
                console.log(resp);
            })
        };
    });