"use strict";

const definitions = require("../_data/definitions.json");

module.exports = term => {
    const matches = definitions.roles.filter(entry => {
        return term.toLowerCase() === entry.term.toLowerCase() || entry.variations.includes(term.toLowerCase());
    });

    if (matches.length > 0) {
        return matches[0];
    }

    return false;
};
