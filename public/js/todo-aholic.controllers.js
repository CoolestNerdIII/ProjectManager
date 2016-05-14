var controllers = angular.module('todo-aholic.controllers', []);

controllers.controller('mainController', function($scope, $http, Todos) {
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

controllers.controller('backlogController', function($scope, $mdDialog, $mdMedia, Category, Item) {
    "use strict";
    $scope.categories = [];

    /**
     * Function to update the categories returned
     */
    $scope.updateCategories = function() {
        Category.query(function(data) {
            $scope.categories = data;
        })
    };

    /**
     * Function to toggle the completion of an item
     * @param item
     */
    $scope.toggle = function(item) {
        if (item.status == "COMPLETE") {
            item.status = "BACKLOG";
        } else {
            item.status = "COMPLETE";
        }

        Item.update({id: item._id}, item);
    };

    /**
     * Function to show dialog for editing an item
     * @param event: Button pressed
     * @param item: Item to be edited
     */
    $scope.editItemDialog = function(event, item) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

        $mdDialog.show({
                controller: DialogController,
                templateUrl: 'partials/dialogs/edit_item.dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                locals: {
                    item: item
                }
            })
            .then(function(item) {
                // Save the updated object
                Item.update({id: item._id}, item);
            });

        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    /**
     * Controller for the dialog action for editing an item
     * @param $scope
     * @param $mdDialog
     * @param item
     * @constructor
     */
    function DialogController($scope, $mdDialog, item) {

        // Convert to a date if object is a string
        if (typeof item.startDate == 'string') {
            item.startDate = new Date(item.startDate);
        }

        // Convert to a date if object is a string
        if (typeof item.endDate == 'string') {
            item.endDate = new Date(item.endDate);
        }

        // Set the scopes data to the selected item
        $scope.item = item;

        // Options for the status of an item
        $scope.statusOptions = ['BACKLOG', 'IN_PROGRESS', 'TESTING', 'COMPLETE'];

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.submit = function() {
            $mdDialog.hide($scope.item);
        };
    }

    /**
     * Perform initial query
     */
    $scope.updateCategories();

});