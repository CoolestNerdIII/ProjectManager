var _ = require('underscore');

function getCategoriesViewModel(categories, items) {
    "use strict";

    var groupedCategories = _
        .chain(items)
        .groupBy(function(item) {
            return item.category._id;
        })
        .map(function(value, key) {

            var cat = value[0].category;
            return {
                created: cat.created,
                name: cat.name,
                _id: cat._id,
                category: key,
                // items: _.omit(value, 'category')
                items: value
            }
        })
        .value();

    for (var i = 0; i < Object.keys(categories).length; i++ ) {

        var cat = categories[i];
        var obj = groupedCategories.filter(function(obj) {
            return obj._id.toString() == cat._id.toString();
        });

        if (!obj || Object.keys(obj).length == 0) {
            groupedCategories.push(cat);
        }
    }

    return groupedCategories;
}

// export the function
module.exports = getCategoriesViewModel;