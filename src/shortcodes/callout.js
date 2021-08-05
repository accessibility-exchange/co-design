"use strict";

module.exports = (content, title) => {
    const titleTag = title ? `<h2>${title}</h2>` : "";
    return `<div class="callout flow">
        ${ titleTag }
        ${ content }</div>`;
};
