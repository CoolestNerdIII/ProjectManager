// useful for displaying information related to the category while abstracting the model
var Category = require('../models/category');

function getCategoryViewModel(category, items) {
    "use strict";
    return {
        name: category.name,
        categoryDescription: category.categoryDescription,
        created: category.created,
        items: items.map(function(item) {
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
            };
        })

    };
}

// Export the function
module.exports = getCategoryViewModel;