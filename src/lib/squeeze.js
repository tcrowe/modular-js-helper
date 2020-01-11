const compact = require("lodash/compact");
const flatten = require("lodash/flatten");
const uniq = require("lodash/uniq");

/**
 * It removes blanks and duplicates in an array.
 *
 * (For lack of a better term.)
 *
 * Lodash flatten → uniq → compact
 * @param {array} arr
 * @returns {array}
 */
const squeeze = arr => compact(uniq(flatten(arr)));

module.exports = squeeze;
