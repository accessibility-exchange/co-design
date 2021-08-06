"use strict";

const definitions = require("../_data/definitions.json");

module.exports = () => {
    return definitions.roles.reduce(function (accumulator, currentValue) {
        accumulator.push(currentValue.term);
        return accumulator.concat(currentValue.variations);
    }, []);
};
