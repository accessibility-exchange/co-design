
"use strict";

module.exports = {
    eleventyComputed: {
        shortTitle: data => data.title.substring(data.title.lastIndexOf(".") + 1, data.title.length),
        step: data => data.title.substring(0, data.title.lastIndexOf(".")),
        eleventyNavigation: {
            key: data => data.title,
            parent: "Process Map",
            order: data => data.step * 10
        }
    }
};
