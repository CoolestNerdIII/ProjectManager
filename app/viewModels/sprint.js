// useful for displaying information related to the sprint while abstracting the model
var Sprint = require('../models/sprint');

// display information on the sprint as well as all of its items
function getSprintViewModel(sprint, items) {
    "use strict";
    return {
        name: sprint.name,
        dateCreated: sprint.dateCreated,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        items: items.map(function (item) {
            return {
                title: item.title,
                itemDescription: item.itemDescription,
                startDate: item.startDate,
                endDate: item.endDate,
                creationDate: item.creationDate,
                status: item.status,
                completionTime: item.completionTime,
                category: item.category,
                sprint: item.sprint,
                url: '/items/' + item._id
            }
        })
    };
}

// Export the function
module.exports = getSprintViewModel;