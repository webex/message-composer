import React from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
import Turndown from 'turndown';

import Quill from './quill';
import {buildContents, buildMentionAvatar, buildMentionText, getFirstName, getQuillText} from './utils';
import './styles.scss';

const md = new MarkdownIt('commonmark'); // converts markdown to html
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
  }

  componentDidMount() {
    const {draft, emitter} = this.props;

    emitter.on('INSERT_TEXT', this.insert);
    emitter.on('SEND', this.handleEnter);

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

    // TODO: using this for testing, remove in final release
    window.quill = this.quill;
    window.md = md;
    window.td = td;
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
    const {send} = this.props;
    const text = getQuillText(this.quill);
    // converts text from markdown to html
    const parsed = md.renderInline(text);

    // TODO: we probably want to remove the markdown characters from text before we pass to displayName

    send({displayName: text, content: parsed});
    // clear the composer and reset the draft
    this.quill.setText('');
    this.saveToDraft();
  }

  // When user types @, this renders the mention list
  handleMention(searchTerm, renderList) {
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
    const participants = this.props.mentions.participants.current;
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

    if (draft?.save) {
      draft.save(getQuillText(this.quill), draft.id);
    }
  }

  // Inserts text into the composer at cursor position
  insert(text) {
    const range = this.quill.getSelection();

    this.quill.insertText(range.index, text);
  }

  render() {
    return (
      <div id="quill-container">
        <div id="quill-composer" />
      </div>
    );
  }
}

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
  send: PropTypes.func,
};

Composer.defaultProps = {
  draft: {},
  mentions: undefined,
  notifyKeyDown: undefined,
  send: undefined,
};

export default Composer;
