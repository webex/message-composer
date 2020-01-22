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
  }

  componentDidMount() {
    const {draft, emitter} = this.props;

    emitter.on('INSERT_TEXT', this.insert);
    emitter.on('SEND', this.handleEnter());

    const bindings = {
      enter: {
        key: 13,
        handler: this.handleEnter(),
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

    // inserts text into composer
    if (draft?.value) {
      // converts text from html to markdown
      const text = td.turndown(draft.value);

      this.quill.setText(text);
    }

    this.quill.on('text-change', this.handleTextChange);

    // TODO: using this for testing, remove in final release
    window.quill = this.quill;
  }

  handleEnter() {
    // TODO: Don't know if there is a better way to do this but...
    // the function passed to keyboard binding will that this binded with quill
    // but we need to access this.props. So we grab it here and save it off as a variable.
    // That way we can use it in the returned function.
    const {send} = this.props;

    return () => {
      const text = this.quill.root.textContent;
      // converts text from markdown to html
      const parsed = md.renderInline(text);

      // TODO: we probably want to remove the markdown characters from text before we pass to displayName

      send({displayName: text, content: parsed});
      this.quill.setText('');
    };
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

  handleTextChange() {
    const {draft, notifyKeyDown} = this.props;

    if (notifyKeyDown) {
      notifyKeyDown();
    }

    if (draft?.save) {
      draft.save(this.quill.root.textContent, draft.id);
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
