
"use strict";

module.exports = {
    eleventyComputed: {
        fullTitle: data => `${data.step}. ${data.title}`,
        eleventyNavigation: {
            key: data => data.title,
            parent: "Process Map",
            order: data => data.step * 10
        }
    }
};
