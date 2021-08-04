/*
Copyright the Trivet copyright holders.

See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-project/trivet/raw/main/AUTHORS.md.

Licensed under the New BSD license. You may not use this file except in compliance with this License.

You may obtain a copy of the New BSD License at
https://github.com/fluid-project/trivet/raw/main/LICENSE.md.
*/

"use strict";
const {parseHTML} = require("linkedom");

module.exports = function (value, outputPath) {
    if (outputPath && outputPath.includes(".html")) {
        let {document} = parseHTML(value);
        const images = [...document.querySelectorAll("main img")];
        const links = [...document.querySelectorAll("main a")];
        const headings = [...document.querySelectorAll(".page--blueprint-step article h2")];

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

        if (headings.length) {
            Array.prototype.forEach.call(headings, heading => {
                const getContent = (elem) => {
                    let elems = [];
                    while (elem.nextElementSibling && elem.nextElementSibling.tagName !== "H2") {
                        elems.push(elem.nextElementSibling);
                        elem = elem.nextElementSibling;
                    }

                    elems.forEach((node) => {
                        node.parentNode.removeChild(node);
                    });

                    return elems;
                };

                heading.innerHTML = `${heading.textContent} <svg width="15" height="9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l6.5 6.5L14 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

                let subhead = heading.nextElementSibling;

                let sub = document.createElement("p");
                sub.className = "subhead";
                sub.textContent = subhead.textContent;

                let contents = getContent(subhead);

                let section = document.createElement("section");
                section.className = "flow";
                section.setAttribute("x-data", "{open: false}");

                let ctrl = document.createElement("button");
                ctrl.className = "accordion";
                ctrl.setAttribute("x-on:click", "open = !open");
                ctrl.setAttribute("x-bind:aria-expanded", "open.toString()");
                ctrl.appendChild(heading);

                let content = document.createElement("div");
                content.className = "content flow";
                content.setAttribute("x-show", "open");

                contents.forEach(node => {
                    content.appendChild(node);
                });

                section.appendChild(ctrl);
                section.appendChild(sub);
                section.appendChild(content);

                subhead.outerHTML = section.outerHTML;
            });
        }

        return "<!DOCTYPE html>\r\n" + document.documentElement.outerHTML;
    }
    return value;
};
