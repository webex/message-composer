import React from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
import Turndown from 'turndown';

import Quill from './quill';

const md = new MarkdownIt('commonmark'); // converts markdown to html
const td = new Turndown(); // converts html to markdown

// Turndown escapes markdown characters to prevent them from being compiled back to html
// We don't need this, so we're just going to return the text without any escaped characters
td.escape = (text) => text;

// TODO: Test list for mention. We will get this list from client later
const list = [
  {id: 1, value: 'Michael'},
  {id: 1, value: 'Pam'},
  {id: 1, value: 'Jim'},
  {id: 1, value: 'Dwight'},
  {id: 1, value: 'Toby'},
];

class Composer extends React.Component {
  constructor(props) {
    super(props);

    this.quill = undefined;
    this.insert = this.insert.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.saveToDraft = this.saveToDraft.bind(this);
  }

  componentDidMount() {
    const {draft, emitter} = this.props;

    emitter.on('INSERT_TEXT', this.insert);
    emitter.on('SEND', this.handleEnter);

    const bindings = {
      enter: {
        key: 13,
        handler: this.handleEnter.bind(this),
      },
    };

    this.quill = new Quill('#quill-composer', {
      modules: {
        keyboard: {
          bindings,
        },
        mention: {
          defaultMenuOrientation: 'top',
          mentionDenotationChars: ['@'],
          source: this.handleMention,
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

      this.quill.setText(text);
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
        this.quill.setText(draft.value);
      } else {
        this.quill.setText('');
      }
    }
  }

  handleEnter() {
    const {send} = this.props;
    const text = this.quill.getText().trim();
    // converts text from markdown to html
    const parsed = md.renderInline(text);

    // TODO: we probably want to remove the markdown characters from text before we pass to displayName

    send({displayName: text, content: parsed});
    // clear the composer and reset the draft
    this.quill.setText('');
    this.saveToDraft();
  }

  // Goes through the list and checks if the search term is in it
  handleMention(searchTerm, renderList) {
    if (searchTerm.length === 0) {
      renderList(list, searchTerm);
    } else {
      const matches = [];

      for (let i = 0; i < list.length; i += 1) {
        if (list[i].value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          matches.push(list[i]);
        }
      }
      renderList(matches, searchTerm);
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

    if (draft?.save) {
      draft.save(this.quill.getText().trim(), draft.id);
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
  notifyKeyDown: PropTypes.func,
  send: PropTypes.func,
};

Composer.defaultProps = {
  draft: {},
  notifyKeyDown: undefined,
  send: undefined,
};

export default Composer;
