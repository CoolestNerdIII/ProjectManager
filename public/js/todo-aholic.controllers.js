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
    $scope.categoryDisplay = [];
    $scope.itemText = '';

    /**
     * Function to update the categories returned
     */
    $scope.updateCategories = function() {
        Category.query(function(data) {
            $scope.categories = data;

            for (var i = 0; i < $scope.categories.length; i++) {
                $scope.categoryDisplay[i] = true;
            }

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
     * Function to create a new item
     * @param category_id
     */
    $scope.newItem = function(category_id) {

        var item = new Item({category: category_id});
        item.title = this.itemText;
        item.$save();

        for(var i = 0; i < $scope.categories.length; i++) {
            var cat = $scope.categories[i];
            if (cat._id.toString() == category_id.toString()) {
                $scope.categories[i].items.push(item);
                break;
            }
        }

        this.itemText = '';

        $scope.newItemText = '';
    };

    /**
     * Function to delete a category and all associated items
     * @param event
     * @param category_id
     */
    $scope.deleteCategory = function(event, category_id) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete this category?')
            .textContent('This will also delete all associated items.')
            .ariaLabel('Category Deletion')
            .targetEvent(event)
            .ok('Yes')
            .cancel('Cancel');
        
        $mdDialog.show(confirm).then(function() {

            var idx = -1;
            for (var i = 0; i < $scope.categories.length; i++) {
                var cat = $scope.categories[i];
                if (cat._id.toString() == category_id.toString()) {
                    idx = i;
                    break;
                }
            }

            Category.delete({id: category_id}, function() {
                if (idx > -1) {
                    $scope.categories.splice(idx, 1);
                    $scope.categoryDisplay.splice(idx, 1);
                }
            });
        })
    };

    /**
     * Toggles the ability to show/hide the category
     * @param index
     */
    $scope.toggleCategory = function(index) {
        $scope.categoryDisplay[index] = !$scope.categoryDisplay[index];
    };

    /**
     * Function to show dialog for editing an item
     * @param event: Button pressed
     * @param item: Item to be edited
     * @param categoryIndex: Index of the category selected
     */
    $scope.editItemDialog = function(event, item, categoryIndex) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

        $mdDialog.show({
                controller: DialogController,
                templateUrl: 'partials/dialogs/edit_item.dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                locals: {
                    item: item,
                    categories: $scope.categories,
                    categoryIndex: categoryIndex
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
     * @param categories
     * @param categoryIndex
     * @constructor
     */
    function DialogController($scope, $mdDialog, item, categories, categoryIndex) {

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

        /**
         * Deletes the selected item from the db and the list
         * @param ev
         */
        $scope.deleteItem = function (ev) {
            $mdDialog.cancel();
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this item?')
                .textContent('')
                .ariaLabel('Category Deletion')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                var idx = categories[categoryIndex].items.indexOf(item);

                Item.delete({id: item._id}, function() {
                    if (idx > -1) {
                        categories[categoryIndex].items.splice(idx, 1);
                    }
                });
            })
        };

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