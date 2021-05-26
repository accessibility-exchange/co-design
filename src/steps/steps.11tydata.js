
"use strict";

module.exports = {
    eleventyComputed: {
        eleventyNavigation: {
            key: data => data.title,
            parent: "Process Map",
            order: data => data.step * 10
        }
    }
};
