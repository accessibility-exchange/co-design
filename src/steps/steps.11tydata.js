
"use strict";

module.exports = {
    eleventyComputed: {
        step: data => data.title.split(" ")[0],
        eleventyNavigation: {
            key: data => data.title,
            parent: "Process Map",
            order: data => data.step * 10
        }
    }
};
