/*
Copyright the Trivet copyright holders.

See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-project/trivet/raw/main/AUTHORS.md.

Licensed under the New BSD license. You may not use this file except in compliance with this License.

You may obtain a copy of the New BSD License at
https://github.com/fluid-project/trivet/raw/main/LICENSE.md.
*/

"use strict";

const fs = require("fs");

const fluidPlugin = require("eleventy-plugin-fluid");
const navigationPlugin = require("@11ty/eleventy-navigation");
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");

// Import transforms
const htmlMinTransform = require("./src/transforms/html-min-transform.js");
const parseTransform = require("./src/transforms/parse-transform.js");

module.exports = function (config) {
    config.setUseGitIgnore(false);

    // Transforms
    config.addTransform("htmlmin", htmlMinTransform);
    config.addTransform("parse", parseTransform);

    // Passthrough copy
    config.addPassthroughCopy({"src/assets/fonts": "assets/fonts"});
    config.addPassthroughCopy({"src/assets/icons": "/"});
    config.addPassthroughCopy({"src/assets/images": "assets/images"});
    config.addPassthroughCopy({"src/assets/media": "assets/media"});

    const now = new Date();

    // Custom collections

    // Updates
    const liveUpdates = update => update.date <= now && !update.data.draft;
    config.addCollection("updates", collection => {
        return [
            ...collection.getFilteredByGlob("./src/updates/*.md").filter(liveUpdates)
        ];
    });

    // Sessions
    config.addCollection("sessions", collection => {
        return [
            ...collection.getFilteredByGlob("./src/sessions/*.md")
        ];
    });

    // RSS Feed
    config.addCollection("updatesFeed", collection => {
        return [...collection.getFilteredByGlob("./src/updates/*.md").filter(liveUpdates)]
            .reverse()
            .slice(0, 10);
    });

    // Plugins
    config.addPlugin(fluidPlugin);
    config.addPlugin(navigationPlugin);
    config.addPlugin(rssPlugin);
    config.addPlugin(syntaxHighlightPlugin);

    // 404
    config.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, bs) {

                bs.addMiddleware("*", (req, res) => {
                    const content_404 = fs.readFileSync("dist/404.html");
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.writeHead(404);
                    res.end();
                });
            }
        }
    });

    return {
        dir: {
            input: "src",
            output: "dist",
            includes: "_includes"
        },
        passthroughFileCopy: true
    };
};
