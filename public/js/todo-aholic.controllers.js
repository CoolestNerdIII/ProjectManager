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
        }
    };

    $scope.markComplete = function(item) {
        item.done = !item.done;
        Todos.update({id: item._id}, item, function(resp) {
            console.log(resp);
        });

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
    $scope.categoryText = '';

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
     * Function to create a new category
     */
    $scope.newCategory = function() {
        var category = new Category({name: this.categoryText});
        category.$save(function(resp) {
            $scope.categories.unshift(resp);
            $scope.categoryDisplay.unshift(true);
        });



        this.categoryText = '';
        $scope.categoryText = '';
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

controllers.controller('sprintListCtrl', function ($scope, $mdDialog, Sprint) {
    $scope.sprints = {};

    $scope.getSprints = function() {
        "use strict";
        $scope.promise = Sprint.query().$promise;

        $scope.promise.then(function(data) {
            for(var i = 0; i < data.length; i++) {
                var spr = data[i];

                if(typeof spr.startDate == 'string') {
                    spr.startDate = new Date(spr.startDate);
                }

                if(typeof spr.endDate == 'string') {
                    spr.endDate = new Date(spr.endDate);
                }

                data[i] = spr;
            }
            
            $scope.sprints = data;
        }, function (response) {
            console.log('Unable to get sprints');
            console.log(response);
        });
    };

    $scope.completionText = function(isComplete) {
        "use strict";
        if (isComplete) return 'Yes';
        else return 'No';
    };

    $scope.deleteSprint = function(event, sprintId, idx) {
        "use strict";
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete this sprint?')
            .textContent('')
            .ariaLabel('Sprint Deletion')
            .targetEvent(event)
            .ok('Yes')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            Sprint.delete({id: sprintId}, function() {
                if (idx > -1) {
                    $scope.sprints.splice(idx, 1);
                }
            });
        })

    };

    /**
     * Save the updated status of the sprint
     * @param sprint
     */
    $scope.saveSprint = function(sprint) {
        "use strict";
        Sprint.update({id:sprint._id}, sprint);
    };

    // $scope.editCompletion = function(event, sprint) {
    //     "use strict";
    //     $mdEditDialog.small({
    //         modelValue: sprint.isComplete,
    //         placeholder: 'Completion of item',
    //         save: function(input)
    //     })
    // };

    $scope.statusOptions = ['true', 'false'];

    $scope.getSprints();
});

controllers.controller('sprintViewCtrl', function ($scope, $stateParams, Sprint, Item) {

    $scope.lists = [
        {
            label: "BACKLOG",
            allowedTypes: ["BACKLOG", "IN_PROGRESS", "TESTING", "COMPLETE"],
            items: []
        },
        {
            label: "IN_PROGRESS",
            allowedTypes: ["BACKLOG", "IN_PROGRESS", "TESTING", "COMPLETE"],
            items: []
        },
        {
            label: "TESTING",
            allowedTypes: ["BACKLOG", "IN_PROGRESS", "TESTING", "COMPLETE"],
            items: []
        },
        {
            label: "COMPLETE",
            allowedTypes: ["BACKLOG", "IN_PROGRESS", "TESTING", "COMPLETE"],
            items: []
        }
    ];

    $scope.updateSprint = function() {
        "use strict";

        Sprint.get({id:$stateParams.sprintId}, function (data) {

            for(var i = 0; i < data.items.length; i++) {
                var item = data.items[i];

                if(item.status == null) {
                    item.status = 'BACKLOG';
                    Item.update({id: item._id}, item);
                }

                if (item.status == "BACKLOG") {
                    $scope.lists[0].items.push(item);
                } else if (item.status == "IN_PROGRESS") {
                    $scope.lists[1].items.push(item);
                } else if (item.status == "TESTING") {
                    $scope.lists[2].items.push(item);
                }  else if (item.status == "COMPLETE") {
                    $scope.lists[3].items.push(item);
                }
            }
        })
    };


    $scope.dropCallback = function(event, index, item, external, type, allowedType) {

        if (type !== allowedType) {
            item.status = allowedType;
            Item.update({id: item._id}, item, function(data) {
                "use strict";
                console.log(data);
            });
        }
        return item;
    };

    $scope.loadAll = function() {
        "use strict";
        Item.query(function(data) {

            for(var i = 0; i < data.length; i++) {
                var item = data[i];
                if (item.status == 'BACKLOG' || item.status == null) {
                    if (!containsObject(item, $scope.lists[0].items)) {
                        $scope.lists[0].items.push(item);
                    }

                }
            }
        })
    };

    function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i]._id === obj._id) {
                return true;
            }
        }

        return false;
    }

    if ($stateParams.sprintId) {
        $scope.updateSprint();
    }
});