/**
 * The decoration mark type that the menu will position itself against.
 * @type {String}
 */
export const CONTEXT_MARK_TYPE = 'mentionContext';

export const USER_MENTION_NODE_TYPE = 'userMention';

/**
 * The regex to use to find the searchQuery.
 *
 * @type {RegExp}
 */
export const CAPTURE_REGEX = /(@)([^@\s]*[ ]?[^@\s]*)$/;