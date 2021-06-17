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
const { DateTime } = require("luxon");

const fluidPlugin = require("eleventy-plugin-fluid");
const navigationPlugin = require("@11ty/eleventy-navigation");
const rssPlugin = require("@11ty/eleventy-plugin-rss");

// Import transforms
const htmlMinTransform = require("./src/transforms/html-min-transform.js");
const parseTransform = require("./src/transforms/parse-transform.js");

module.exports = function (config) {
    config.setUseGitIgnore(false);

    // Transforms
    config.addTransform("htmlmin", htmlMinTransform);
    config.addTransform("parse", parseTransform);

    // Filters
    config.addFilter("formatTime", function (date) {
        return DateTime.fromISO(new Date(date).toISOString())
            .setZone("America/Toronto")
            .toFormat("t ZZZZ");
    });

    // Passthrough copy
    config.addPassthroughCopy({"src/admin/": "admin"});
    config.addPassthroughCopy({"src/assets/fonts": "assets/fonts"});
    config.addPassthroughCopy({"src/assets/icons": "/"});
    config.addPassthroughCopy({"src/assets/images": "assets/images"});
    config.addPassthroughCopy({"src/assets/media": "assets/media"});

    const now = new Date();

    // Custom collections

    // Updates
    const liveUpdates = update => update.date <= now;
    config.addCollection("updates", collection => {
        return [
            ...collection.getFilteredByGlob("./src/updates/*.md").filter(liveUpdates)
        ];
    });

    // Sessions
    const upcomingSessions = session => session.data.start >= now;
    const pastSessions = session => session.data.end <= now;

    config.addCollection("upcomingSessions", collection => {
        return [
            ...collection.getFilteredByGlob("./src/sessions/*.md")
                .filter(upcomingSessions)
                .sort(function (a, b) {
                    return a.data.start - b.data.start;
                })
        ];
    });

    config.addCollection("pastSessions", collection => {
        return [
            ...collection.getFilteredByGlob("./src/sessions/*.md")
                .filter(pastSessions)
                .sort(function (a, b) {
                    return a.data.start - b.data.start;
                })
        ];
    });

    config.addCollection("steps", collection => {
        return [
            ...collection.getFilteredByGlob("./src/steps/*.md")
                .sort(function (a, b) {
                    return a.data.step - b.data.step;
                })
        ];
    });

    // RSS Feed
    config.addCollection("updatesFeed", collection => {
        return [...collection.getFilteredByGlob("./src/updates/*.md").filter(liveUpdates)]
            .reverse()
            .slice(0, 10);
    });

    // Pandoc sources
    config.addCollection("pandoc", collection => {
        return collection.getAll().filter(item => {
            return "publish" in item.data && item.data.publish === true;
        });
    });

    // Plugins
    config.addPlugin(fluidPlugin);
    config.addPlugin(navigationPlugin);
    config.addPlugin(rssPlugin);

    config.addFilter("phaseFilter", function (collection, phase) {
        if (!phase) {
            return collection;
        }
        const filtered = collection.filter(item => item.data.phase === phase);
        return filtered;
    });

    config.addFilter("downloadUrl", function (url, format) {
        return `${url.slice(0, -1)}.${format}`;
    });

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
        // markdownTemplateEngine: "njk",
        passthroughFileCopy: true
    };
};
