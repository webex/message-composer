import React from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
import LinkSchemePlugin from 'markdown-it-linkscheme';
import Turndown from 'turndown';
import {isFunction} from 'lodash';

import Quill from './quill';
import {
  buildContents,
  buildMentionAvatar,
  buildMentionText,
  getFirstName,
  getMentions,
  getQuillText,
  keepReplacement,
  replaceMentions,
} from './utils';
import SanitizePlugin from './sanitize';
import './styles.scss';

// converts markdown to html
// options: break converts new line (\n) into <br> tags
const md = new MarkdownIt('commonmark', {breaks: true});

// converts html to markdown
// options: codeBlockStyle: 'fenced' will wrap code blocks around ``` rather than the default of indents
// keepReplacement: function that converts spark-mention tags to our placeholder mentions for conversion
const td = new Turndown({codeBlockStyle: 'fenced', keepReplacement});

// not a full sanitization plugin
// only converts < and > carots to their html entities
md.use(SanitizePlugin);
// add a scheme (ie: http://) to a link if it doesn't have one
md.use(LinkSchemePlugin);

// Turndown escapes markdown characters to prevent them from being compiled back to html
// We don't need this, so we're just going to return the text without any escaped characters
td.escape = (text) => text;
// Turndown tries to convert all html elements. This is a filter for the ones to keep
td.keep(['spark-mention']);

class Composer extends React.Component {
  constructor(props) {
    super(props);

    this.quill = undefined;
    this.insert = this.insert.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMentionSelect = this.handleMentionSelect.bind(this);
    this.saveToDraft = this.saveToDraft.bind(this);
    this.openMentionList = this.openMentionList.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentDidMount() {
    const {draft, emitter, placeholder} = this.props;

    emitter.on('INSERT_TEXT', this.insert);
    emitter.on('SEND', this.handleEnter);
    emitter.on('OPEN_MENTION', this.openMentionList);
    emitter.on('FOCUS', this.handleFocus);

    const bindings = {
      enter: {
        key: 13,
        // need to bind our own this or else quill will bind their own and cause us to not be able to access other class methods
        handler: this.handleEnter.bind(this),
      },
    };

    this.quill = new Quill('#quill-composer', {
      modules: {
        keyboard: {
          bindings,
        },
        mention: {
          dataAttributes: ['displayName', 'objectType', 'src'],
          defaultMenuOrientation: 'top',
          mentionDenotationChars: ['@'],
          onSelect: this.handleMentionSelect,
          renderItem: this.handleMentionItem,
          source: this.handleMention.bind(this),
          spaceAfterInsert: false,
        },
        toolbar: {
          container: '#toolbar',
        },
      },
      formats: ['mention'],
      placeholder,
    });

    // inserts the initial text to the composer
    // may contain formats as html tags, so convert those to markdowns
    if (draft?.value) {
      // replace new lines with <br> tag and new line so it will display properly
      // turndown will trim \n in text, so add a <br> tag since we want the line break
      // but turndown doesn't trim them in code blocks, but will ignore <br> tags
      const modified = draft.value.replace(/\n/g, '<br />\n');

      // converts text from html to a string with markdown
      // remove the extra new line before the close code fence
      const text = td.turndown(modified).replace(/\n```/g, '```');

      // there may be mentions, so convert it to deltas before we insert
      const contents = buildContents(text);

      this.quill.setContents(contents);
    }

    this.quill.on('text-change', this.handleTextChange);
  }

  componentDidUpdate(prevProps) {
    const {draft, mentions, placeholder} = this.props;
    const prevDraft = prevProps.draft;

    // updates the text in the composer as we switch conversations
    if (prevDraft.id !== draft.id) {
      if (draft?.value) {
        // there may be mentions, so convert it to deltas before we insert
        const contents = buildContents(draft.value, mentions?.participants?.current);

        this.quill.setContents(contents);
      } else {
        this.quill.setText('');
      }
    }

    // update the placeholder if it changed
    if (prevProps.placeholder !== placeholder) {
      this.quill.root.dataset.placeholder = placeholder;
    }
  }

  handleEnter() {
    const {onError, send} = this.props;

    try {
      // gets the text from the composer with mentions as a placeholder string
      const text = getQuillText(this.quill);

      // gets the ids that were mentioned
      const mentioned = getMentions(this.quill);

      // converts text from markdown to html
      // element tags will have new lines after them which we don't want so we remove them here too
      // new lines in the text will be represented with a br tag so no need to worry about them
      const marked = md.render(text).replace(/>\n/g, '>');

      // convert our mention placeholders to mention elements
      // pass in the mentioned people we got earlier so we only convert the ones that were actually mentioned
      const parsed = replaceMentions(marked, mentioned);

      // after parsing from markdown, text will have the p tags around it, remove them so we can check if there are other html tags present
      // we can ignore p tags because if there are no other element tags, we can just display the original text instead
      const shortened = parsed.replace(/<\/?p>/g, '');

      // checks if we have any other html tags. this would indicate there were markdowns or mentions in the original text
      // this should not match <br /> tags
      const hasMarkdown = /<.+?>(?:.|\n)+<\/.+?>/.test(parsed);

      const object = {displayName: text.trim()};

      // if there are no markdowns, then we only need to send the displayName for the activity object with the original text
      // if there are markdowns, then strip the markdowns from the parsed text for displayName
      // and send content with the html tags
      if (hasMarkdown) {
        // removes all html tags
        const stripped = shortened.replace(/<.+?>/g, '');

        object.displayName = stripped;
        object.content = parsed;
      }

      // if there are mentions then include them in the object
      if (mentioned.people.length) {
        object.mentions = mentioned.people;
      }

      // sends the message, if it succeeded then clear the composer
      if (send(object)) {
        // clear the composer and reset the draft
        this.quill.setText('');
        this.saveToDraft();
      }
    } catch (e) {
      if (isFunction(onError)) {
        onError('QuillComposer', 'handleEnter', e);
      }
    }
  }

  // When user types @, this renders the mention list
  handleMention(searchTerm, renderList) {
    const {onError} = this.props;

    try {
      const participants = this.props.mentions.participants.current;
      let matches;

      // Goes through the list and checks if the search term is in it
      if (searchTerm.length === 0) {
        matches = participants.slice(0, 20);
      } else {
        matches = [];

        for (let i = 0; i < participants.length; i += 1) {
          if (matches.length >= 20) {
            // only show up to 20 people
            break;
          }

          if (participants[i].displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            matches.push(participants[i]);
          }
        }
      }

      renderList(matches, searchTerm);
    } catch (e) {
      if (isFunction(onError)) {
        onError('QuillComposer', 'handleMention', e);
      }
    }
  }

  // This renders each item in the mention list
  // The return is set as the innerHTML of an element
  handleMentionItem(item) {
    const avatar = buildMentionAvatar(item);
    const text = buildMentionText(item);

    return `${avatar}${text}`;
  }

  // Called when user selects a mention item
  handleMentionSelect(item, insertItem) {
    const {mentions, onError} = this.props;

    try {
      const participants = mentions.participants.current;
      const copy = {...item};
      const name = item.displayName;
      const first = getFirstName(name);

      // show just the first name unless someone else has the same first name
      // check how many other participants have the same first name
      const duplicates = participants.reduce((sum, participant) => {
        const given = getFirstName(participant.displayName);

        return first === given ? sum + 1 : sum;
      }, 0);

      // if there is more than one of you, then show full name instead
      copy.value = duplicates > 1 ? name : first;

      insertItem(copy);
    } catch (e) {
      if (isFunction(onError)) {
        onError('QuillComposer', 'handleMentionSelect', e);
      }
    }
  }

  handleTextChange(delta, oldDelta, source) {
    const {notifyKeyDown} = this.props;

    // only do these stuff if user initiated
    if (source === 'user') {
      if (notifyKeyDown) {
        notifyKeyDown();
      }

      this.saveToDraft();
    }
  }

  saveToDraft() {
    const {draft} = this.props;
    const text = getQuillText(this.quill);

    if (draft?.save) {
      draft.save(text, draft.id);
    }
  }

  // Inserts text into the composer at cursor position
  insert(text) {
    const {onError} = this.props;

    try {
      // length of the content in the editor
      const length = this.quill.getLength();
      // position of cursor in the editor
      const selection = this.quill.getSelection();
      // selection will be null if user hasn't selected the editor yet
      // in that case, insert to the end of the line
      const index = selection ? selection.index : length - 1;

      // insert the text and move cursor to after it
      this.quill.insertText(index, text, 'user');
      this.quill.setSelection(index + text.length);
    } catch (e) {
      if (isFunction(onError)) {
        onError('QuillComposer', 'insert', e);
      }
    }
  }

  openMentionList() {
    const length = this.quill.getLength();
    const selection = this.quill.getSelection();
    const index = selection ? selection.index : length - 1;

    // to open the mention list, we need to clear the user's selection first
    // then insert the @ character and set the selection to after the character
    this.quill.setSelection();
    this.quill.insertText(index, '@');
    this.quill.setSelection(index + 1);
  }

  handleFocus() {
    // setting the cursor to the end of the text will also give focus
    this.quill.setSelection(this.quill.getLength());
  }

  render() {
    return <div id="quill-composer" />;
  }
}

Composer.displayName = 'QuillComposer';

Composer.propTypes = {
  draft: PropTypes.shape({
    id: PropTypes.any,
    value: PropTypes.object,
    save: PropTypes.func,
  }),
  emitter: PropTypes.shape({
    on: PropTypes.func,
    off: PropTypes.func,
    emit: PropTypes.func,
  }).isRequired,
  mentions: PropTypes.shape({
    participants: PropTypes.shape({
      current: PropTypes.array,
    }),
  }),
  notifyKeyDown: PropTypes.func,
  onError: PropTypes.func,
  placeholder: PropTypes.string,
  send: PropTypes.func,
};

Composer.defaultProps = {
  draft: undefined,
  mentions: undefined,
  notifyKeyDown: undefined,
  onError: undefined,
  placeholder: 'Compose something awesome...',
  send: undefined,
};

export default Composer;
