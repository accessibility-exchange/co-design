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
                            const entry = getEntry(term);
                            done.push(term);
                            entry.variations.forEach(variation => {
                                done.push(variation);
                            });
                            content = content.replace(found[0], `<span class="term" data-id="${i}">${found[0]}</span>`);
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
            terms.forEach(term => {
                term.outerHTML = `<span class="term" x-data="{ toggled : false }" @keyup.esc.window="toggled = false"><button @click="toggled = ! toggled" :aria-expanded="toggled.toString()" aria-labelledby="term-btn-${term.dataset.id} term-${term.dataset.id}" aria-describedby="definition-${term.dataset.id}">?<span class="visually-hidden" id="term-btn-${term.dataset.id}">more info about</span></button> <span id="term-${term.dataset.id}">${term.innerText}</span><span class="definition" id="definition-${term.dataset.id}" role="region" aria-describedby="term-${term.dataset.id}" tabindex="0" x-cloak x-show="toggled" @click.outside="toggled = false">${definitions[term.dataset.id - 1]}</span></span>`;
            });
        }

        return "<!DOCTYPE html>\r\n" + document.documentElement.outerHTML;
    }
    return value;
};
