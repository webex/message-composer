"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.CAPTURE_REGEX=exports.USER_MENTION_NODE_TYPE=exports.CONTEXT_MARK_TYPE=void 0;/**
 * The decoration mark type that the menu will position itself against.
 * @type {String}
 */var CONTEXT_MARK_TYPE="mentionContext";exports.CONTEXT_MARK_TYPE="mentionContext";var USER_MENTION_NODE_TYPE="userMention";/**
 * The regex to use to find the searchQuery.
 *
 * @type {RegExp}
 */exports.USER_MENTION_NODE_TYPE="userMention";var CAPTURE_REGEX=/(@)([^@\s]*[ ]?[^@\s]*)$/;exports.CAPTURE_REGEX=CAPTURE_REGEX;