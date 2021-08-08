/*
Copyright the Trivet copyright holders.

See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-project/trivet/raw/main/AUTHORS.md.

Licensed under the New BSD license. You may not use this file except in compliance with this License.

You may obtain a copy of the New BSD License at
https://github.com/fluid-project/trivet/raw/main/LICENSE.md.
*/

"use strict";

const getEntry = require("../utils/getEntry.js");
const getTerms = require("../utils/getTerms.js");

const {parseHTML} = require("linkedom");

module.exports = function (value, outputPath) {
    if (outputPath && outputPath.includes(".html")) {
        let {document} = parseHTML(value);
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

        const sections = [...document.querySelectorAll("main section .content")];
        const definitions = [];

        if (sections.length) {
            let i = 1;
            const dictionary = getTerms();
            const done = [];

            sections.forEach(section => {
                let content = section.innerHTML;

                dictionary.forEach(term => {
                    if (!done.includes(term)) {
                        let expression = new RegExp(term, "i");
                        let found = content.match(expression);
                        if (found) {
                            done.push(term);
                            const entry = getEntry(term);
                            content = content.replace(found[0], `<span class="term" x-data="{ toggled : false }" @keyup.esc.window="toggled = false">
                                    <button @click="toggled = ! toggled" :aria-expanded="toggled.toString()" aria-labelledby="term-btn-${i} term-${i}" aria-describedby="definition-${i}">?<span class="visually-hidden" id="term-btn-${i}">more info about</span></button>
                                    <span id="term-${i}">${found[0]}</span>
                                </span>`);
                            definitions.push(entry.definition);
                            i++;
                        }
                    }
                });
                section.innerHTML = content;
            });
        }

        const terms = [...document.querySelectorAll("main section .term")];

        if (terms.length) {
            let i = 1;
            terms.forEach(term => {
                term.innerHTML = `${term.innerHTML}<span class="definition" id="definition-${i}" role="region" aria-describedby="term-${i}" tabindex="0" x-cloak x-show="toggled" @click.outside="toggled = false">${definitions[i - 1]}</span>`;
                i++;
            });
        }

        return "<!DOCTYPE html>\r\n" + document.documentElement.outerHTML;
    }
    return value;
};
