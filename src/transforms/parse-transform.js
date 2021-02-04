/*
Copyright the Trivet copyright holders.

See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-project/trivet/raw/main/AUTHORS.md.

Licensed under the New BSD license. You may not use this file except in compliance with this License.

You may obtain a copy of the New BSD License at
https://github.com/fluid-project/trivet/raw/main/LICENSE.md.
*/

"use strict";
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

module.exports = function (value, outputPath) {
    if (outputPath && outputPath.indexOf(".html") > -1) {
        const DOM = new JSDOM(value, {
            resources: "usable"
        });

        const document = DOM.window.document;
        const images = [...document.querySelectorAll("main img")];
        const links = [...document.querySelectorAll("main a")];

        if (images.length) {
            images.forEach(image => {
                // Enable native lazy-loading.
                image.setAttribute("loading", "lazy");
            });
        }

        if (links.length) {
            links.forEach(link => {
                if (
                    !link.href.startsWith("/")
                    && !link.href.startsWith("#")
                    && !link.href.startsWith("https://accessibility-in-action.inclusivedesign.ca/")
                ) {
                    link.setAttribute("rel", "external");
                }
            });
        }

        return "<!DOCTYPE html>\r\n" + document.documentElement.outerHTML;
    }
    return value;
};
