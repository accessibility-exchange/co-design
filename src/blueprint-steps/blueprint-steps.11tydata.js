
"use strict";

module.exports = {
    eleventyComputed: {
        eleventyNavigation: {
            key: data => data.title,
            parent: "Service blueprint",
            order: data => data.step
        }
    }
};
