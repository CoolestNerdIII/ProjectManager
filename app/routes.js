var express = require('express');
var Todo = require('./models/todo');
var Category = require('./models/category');
var Item = require('./models/item');
var Sprint = require('./models/sprint');
var categoryViewModel = require('./viewModels/category');
var categoriesViewModel = require('./viewModels/categories');
var sprintViewModel = require('./viewModels/sprint');
var User = require('./models/user');
var jwt = require('express-jwt');

var auth = jwt({
    secret: require('../config/auth').randomSecret,
    userProperty: 'payload'
});

module.exports = function (app, passport) {
    "use strict";

    var router = express.Router();

    router.use(function(req, res, next) {
        // log each request to the console
        console.log(req.method, req.url);

        next();
    });

    // API ROUTES =============================================
    
    // AUTHENTICATION ====================================
    router.route('/register')
        // Handle new users registering
        .post(function(req, res) {
            var user = new User();

            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.local.email = req.body.email;
            user.local.password = user.generateHash(req.body.password);

            user.save(function(err) {
                var token;
                token = user.generateJwt();
                res.status(200);
                res.json({
                    "token": token
                });
            });

        });
    
    router.route('/login')
        // handle returning users logging
        .post(function(req, res) {
            passport.authenticate('local-login', function(err, user, info) {
                var token;

                if (err) {
                    res.status(404).json(err);
                    return;
                }

                // If a user is found
                if (user) {
                    token = user.generateJwt();
                    res.status(200);
                    res.json({token: token});
                } else {
                    res.status(401).json(info);
                }
            })(req, res);
            
        });
    
    router.route('/profile/:user_id')
        // return profile details when given a userid
        .get(function(req, res) {
            
        });

    // ITEMS =============================================
    router.route('/items')
        // Create a new item
        .post(function(req, res) {
            Item.create({
                title: req.body.title,
                itemDescription: req.body.itemDescription,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                status: req.body.status,
                category: req.body.category,
                sprint: req.body.Sprint

            }, function(err, item) {
                if (err) {
                    res.send(err);
                }

                res.json(item);
            });
        })

        .get(function(req, res) {
            Item.find(function(err, items) {
                if (err) {
                    res.send(err);
                }

                res.json(items);
            })
        });

    router.route('/items/:item_id')

        // Return the item with that id
        .get(function(req, res) {
            Item.findById(req.params.item_id, function(err, item) {
                if (err) {
                    res.send(err);
                }
                res.json(item);
            });
        })

        // Perform an update/put on a single item
        .put(function(req, res) {
            // Search based on the id
            Item.findById(req.params.item_id, function(err, item) {
                if (err) {
                    res.send(err);
                }

                // update the information
                item.title = req.body.title;
                item.itemDescription = req.body.itemDescription;
                item.startDate = req.body.startDate;
                item.endDate = req.body.endDate;
                item.status = req.body.status;
                item.completionTime = req.body.completionTime;
                item.category = req.body.category;
                item.sprint = req.body.sprint;

                // save the item
                item.save(function(err) {
                    if (err) {
                        res.send(err);
                    }

                    // Send back the updated item
                    res.json(item);
                });

            });
        })

        // Perform a delete on a single item
        .delete(function(req, res) {
            Item.remove({
                _id: req.params.item_id
            }, function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Successfully deleted' });
            });
        });

    // CATEGORIES =============================================
    router.route('/categories')
        // Create a new item
        .post(function(req, res) {
            Category.create({
                name: req.body.name,
                categoryDescription: req.body.categoryDescription

            }, function(err, item) {
                if (err) {
                    res.send(err);
                }

                res.json(item);
            });
        })

        .get(function(req, res) {
            Category.find(function(err, categories) {
                if (err) {
                    res.send(err);
                }

                Item.find({}).populate('category').exec(function(err, items) {
                    if (err) {
                        res.send(err);
                    }

                    res.json(categoriesViewModel(categories, items));

                });
            })

        });

    router.route('/categories/:category_id')

        // Return the category with that id
        .get(function(req, res) {
            Category.findById(req.params.category_id, function(err, category) {
                if (err) {
                    res.send(err);
                }

                if (!category) {
                    res.send({error: 'Unable to find category'});
                }

                category.getItems(function(err, items) {
                    if (err) {
                        res.send(err);
                    }

                    res.json(categoryViewModel(category, items));
                })
            });
        })

        // Perform an update/put on a single category
        .put(function(req, res) {
            // Search based on the id
            Category.findById(req.params.category_id, function(err, category) {
                if (err) {
                    res.send(err);
                }

                // update the information
                category.name = req.body.name;
                category.categoryDescription = req.body.categoryDescription;

                // save the item
                category.save(function(err) {
                    if (err) {
                        res.send(err);
                    }

                    // Send back the updated item
                    res.json(category);
                });

            });
        })

        // Perform a delete on a single category and all associated items
        .delete(function(req, res) {
            Item.remove( {category: req.params.category_id}, function (err) {
                if (err) {
                    console.log('Error removing items with category: ' + err );
                }
            });

            Category.remove({_id: req.params.category_id}, function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Successfully deleted' });
            });
        });

    // SPRINTS =============================================
    router.route('/sprints')

        // Create a new sprint
        .post(function(req, res) {
            Sprint.create({
                name: req.body.name,
                startDate: req.body.startDate,
                endDate: req.body.endDate

            }, function(err, sprint) {
                if (err) {
                    res.send(err);
                }

                res.json(sprint);
            });
        })

        // Return all sprints
        .get(function(req, res) {
            Sprint.find(function(err, sprints) {
                if (err) {
                    res.send(err);
                }

                res.json(sprints);
            })
        });

    router.route('/sprints/:sprint_id')

        // Return the item with that id
        .get(function(req, res) {
            Sprint.findById(req.params.sprint_id, function(err, sprint) {
                if (err) {
                    res.send(err);
                }

                if (!sprint) {
                    res.send({ error: 'Unable to find sprint' });
                }

                sprint.getItems(function(err, items) {
                    if (err) {
                        res.send(err);
                    }
                    res.json(sprintViewModel(sprint, items));
                });
            });
        })

        // Perform an update/put on a single item
        .put(function(req, res) {
            // Search based on the id
            Sprint.findById(req.params.sprint_id, function(err, sprint) {
                if (err) {
                    res.send(err);
                }

                // update the information
                sprint.name = req.body.name;
                sprint.startDate = req.body.startDate;
                sprint.endDate = req.body.endDate;

                // save the sprint
                sprint.save(function(err) {
                    if (err) {
                        res.send(err);
                    }

                    // Send back the updated item
                    res.json(sprint);
                });

            });
        })

        // Perform a delete on a single item
        .delete(function(req, res) {
            //TODO: Confirm this works
            Item.update({sprint: req.params.sprint_id}, {sprint: null}, function(err) {
                console.log("Error removing the sprint from items: " + err);
            });

            Sprint.remove({
                _id: req.params.sprint_id
            }, function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Successfully deleted' });
            });
        });


    // TODOS =============================================
    router.route('/todos')
        // Create a new item
        .post(function(req, res) {
            // Create a todo, information comes from AJAX request from angular
            Todo.create({
                text: req.body.text,
                done: false
            }, function (err, todo) {
                if (err) {
                    res.send(err)
                }

                res.json(todo);

            });
        })

        // Return all of the current items
        .get(function(req, res) {
            // user mongoose to get all todos in the database
            Todo.find(function (err, todos) {

                if (err) {
                    res.send(err)
                }

                res.json(todos); // return all todos in JSON format

            });
        });

    router.route('/todos/:todo_id')

        // Return the item with that id
        .get(function(req, res) {
            Todo.findById(req.params.todo_id, function(err, todo) {
                if (err) {
                    res.send(err);
                }
                res.json(todo);
            });
        })

        // Perform an update/put on a single item
        .put(function(req, res) {
            // Find the todo that we want
            Todo.findById(req.params.todo_id, function(err, todo) {
                if (err) {
                    res.send(err);
                }

                // update the information
                todo.text = req.body.text;
                todo.done = req.body.done;

                // save the item
                todo.save(function(err) {
                    if (err) {
                        res.send(err);
                    }

                    // Send back the updated item
                    res.json(todo);
                });

            });
        })

        // Perform a delete on a single item
        .delete(function(req, res) {
            Todo.remove({
                _id: req.params.todo_id
            }, function (err) {
                if (err) {
                    res.send(err);
                }

                res.json({message: 'Successfully deleted' });
            });
        });

    app.use('/api', router);

    // // ===================================
    // // HOME PAGE (with login links) ======
    // // ===================================
    // app.get('/', function(req, res) {
    //     res.render('index.ejs'); // load the index.ejs file
    // });
    //
    // // ===================================
    // // LOGIN =============================
    // // ===================================
    // // Show the login form
    // app.get('/login', function(req, res) {
    //     // render the page and pass in any flash data if it exists
    //     res.render('login.ejs', { message: req.flash('loginMessage') });
    // });
    //
    // // process the login form
    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect : '/profile', // redirect to the secure profile section
    //     failureRedirect : '/login', // redirect back to the signup page if there is an error
    //     failureFlash : true // allow flash messages
    // }));
    //
    // // ===================================
    // // SIGNUP ============================
    // // ===================================
    // // Show the signup form
    // app.get('/signup', function(req, res) {
    //     // render the page and pass in any flash data if it exists
    //     res.render('signup.ejs', { message: req.flash('signupMessage') });
    // });
    //
    // // process the signup form
    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect: '/profile', // redirect to the secure profile section
    //     failureRedirect: '/signup', // redirect back to the signup page if there is an error
    //     failureFlash: true // allow flash messages
    // }));
    //
    // // ===================================
    // // PROFILE ===========================
    // // ===================================
    // // We want this page protected so that you have to be logged in to visit
    // app.get('/profile', isLoggedIn,  function(req, res) {
    //     res.render('profile.ejs', {
    //         user: req.user // get the user out of session and pass to template
    //     });
    // });
    //
    // // ===================================
    // // LOGOUT ============================
    // // ===================================
    // app.get('/logout', function(req, res) {
    //     req.logout();
    //     res.redirect('/');
    // });
    //
    // ===================================
    // CATCH ALL =========================
    // ===================================
    app.get('*', function (req, res) {
        res.sendFile('index.html', {root: 'public'}); // load the single view file
    });
    //
    //
    // // route middleware to make sure a user is logged in
    // function isLoggedIn(req, res, next) {
    //
    //     // if user is authenticated in the session, carry on
    //     if (req.isAuthenticated())
    //         return next();
    //
    //     // if they aren't redirect them to the home page
    //     res.redirect('/');
    // }

};