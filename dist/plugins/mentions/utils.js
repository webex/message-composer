"use strict";var _types=require("./types");Object.defineProperty(exports,"__esModule",{value:!0}),exports.hasValidAncestors=hasValidAncestors,exports.getInput=void 0;/**
 * Determine if the current selection has valid ancestors for a context. In our
 * case, we want to make sure that the mention is only a direct child of a
 * paragraph.
 * 
 * @param {Value} value
 */function hasValidAncestors(a){var b=a.document,c=a.selection,d=b.getClosest(c.start.key,// In this simple case, we only want mentions to live inside a paragraph.
// This check can be adjusted for more complex rich text implementations.
function(a){return"paragraph"!==a.type});return!d}/**
 * Get get the potential mention input.
 *
 * @type {Value}
 */var getInput=function(a){// In some cases, like if the node that was selected gets deleted,
// `startText` can be null.
if(!a.startText)return[null,null];var b=a.selection.start.offset,c=a.startText.text.slice(0,b),d=_types.CAPTURE_REGEX.exec(c);return d?[d[1],d[2]]:[null,null]};exports.getInput=getInput;