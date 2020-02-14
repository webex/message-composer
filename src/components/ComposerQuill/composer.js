import React from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
import Turndown from 'turndown';
import {isFunction} from 'lodash';

import Quill from './quill';
import {buildContents, buildMentionAvatar, buildMentionText, getFirstName, getQuillText} from './utils';
import './styles.scss';

const md = new MarkdownIt('commonmark', {breaks: true}); // converts markdown to html
const td = new Turndown(); // converts html to markdown

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
  }

  componentDidMount() {
    const {draft, emitter} = this.props;

    emitter.on('INSERT_TEXT', this.insert);
    emitter.on('SEND', this.handleEnter);
    emitter.on('OPEN_MENTION', this.openMentionList);

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
      placeholder: 'Compose something awesome...',
    });

    // inserts the initial text to the composer
    // may contain formats as html tags, so convert those to markdowns
    if (draft?.value) {
      // replace new lines with <br> tag so turndown can convert it properly
      const modified = draft.value.replace(/\n/g, '<br />');
      // converts text from html to a string with markdown
      const text = td.turndown(modified);
      // there may be mentions, so convert it to deltas before we insert
      const contents = buildContents(text);

      this.quill.setContents(contents);
    }

    this.quill.on('text-change', this.handleTextChange);
  }

  componentDidUpdate(prevProps) {
    const {draft} = this.props;
    const prevDraft = prevProps.draft;

    // updates the text in the composer as we switch conversations
    if (prevDraft.id !== draft.id) {
      if (draft?.value) {
        // there may be mentions, so convert it to deltas before we insert
        const contents = buildContents(draft.value);

        this.quill.setContents(contents);
      } else {
        this.quill.setText('');
      }
    }
  }

  handleEnter() {
    const {onError, send} = this.props;

    try {
      // get the text from the composer as-is and a sanitized version
      // check the sanitized version if there are markdown or mentions in it
      // if there are, then we will parse and use the sanitized version
      // otherwise we will send the original without the content property
      const {original, sanitized} = getQuillText(this.quill);

      // converts text from markdown to html
      // element tags will have new lines after them which we don't want so we remove them here too
      // new lines in the text will be represented with a br tag so no need to worry about them
      const parsed = md.render(sanitized).replace(/\n/g, '');

      // after parsing, text will have the p tags around it, remove them so we can check if there are other html tags present
      // we can ignore p tags because if there are no other element tags, we can just display the original text instead
      const shortened = parsed.replace(/<\/?p>/g, '');

      // checks if we have any other html tags. this would indicate there were markdowns in the original text
      // this should not match <br /> tags
      const hasMarkdown = /<.+?>.+<\/.+?>/.test(shortened);

      const object = {displayName: original.trim()};

      // if there are no markdowns, then we only need to send the displayName for the activity object
      // if there are markdowns, then strip the markdowns from the text for displayName
      // and send content with the html tags
      if (hasMarkdown) {
        // removes all html tags
        const stripped = shortened.replace(/<.+?>/g, '');

        object.displayName = stripped;
        object.content = parsed;
      }

      send(object);
      // clear the composer and reset the draft
      this.quill.setText('');
      this.saveToDraft();
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
    const {original} = getQuillText(this.quill);

    if (draft?.save) {
      draft.save(original, draft.id);
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

  render() {
    return (
      <div id="quill-container">
        <div id="quill-composer" />
      </div>
    );
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
  send: PropTypes.func,
};

Composer.defaultProps = {
  draft: {},
  mentions: undefined,
  notifyKeyDown: undefined,
  onError: undefined,
  send: undefined,
};

export default Composer;