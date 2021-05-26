/*
Copyright the Trivet copyright holders.

See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-project/trivet/raw/master/AUTHORS.md.

Licensed under the New BSD license. You may not use this file except in compliance with this License.

You may obtain a copy of the New BSD License at
https://github.com/fluid-project/trivet/raw/master/LICENSE.md.
*/

"use strict";

(function () {
    const headings = document.querySelectorAll(".page--step article h3");

    Array.prototype.forEach.call(headings, heading => {
        const getContent = (elem) => {
            let elems = [];
            while (elem.nextElementSibling && elem.nextElementSibling.tagName !== "H3") {
                elems.push(elem.nextElementSibling);
                elem = elem.nextElementSibling;
            }

            elems.forEach((node) => {
                node.parentNode.removeChild(node);
            });

            return elems;
        };

        let contents = getContent(heading);

        if (contents.length) {
            let summary = document.createElement("summary");
            summary.innerHTML = heading.textContent;

            let details = document.createElement("details");

            contents.forEach(node => {
                details.appendChild(node);
            });

            details.insertBefore(summary, details.firstChild);

            heading.outerHTML = details.outerHTML;
        } else {
            heading.outerHTML = `<p class="summary">${heading.textContent}</p>`;
        }

    });
})();
