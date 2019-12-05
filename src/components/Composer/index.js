import React from 'react';
import PropTypes from 'prop-types';
import {EditorState, RichUtils} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import 'draft-js/dist/Draft.css';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import {stateToHTML} from 'draft-js-export-html';
import classnames from 'classnames';

import './styles.scss';

const STYLES = {
  BOLD: 'BOLD',
  ITALIC: 'ITALIC',
  UNDERLINE: 'UNDERLINE',
};

export default class Composer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      hasFocus: false,
    };
    this.onBlur = () => this.setState({hasFocus: false});
    this.onFocus = () => this.setState({hasFocus: true});

    this.onChange = this.onChange.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);

    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);

    this.focus = () => this.draftEditor.focus();
  }

  componentDidMount() {
    if (this.props.commands) {
      this.props.commands({
        toggleBold: () => this.toggleInlineStyle(STYLES.BOLD),
        toggleItalic: () => this.toggleInlineStyle(STYLES.ITALIC),
        toggleUnderline: () => this.toggleInlineStyle(STYLES.UNDERLINE),
      });
    }
  }

  onChange(editorState) {
    if (this.props.active) {
      const currentStyle = editorState.getCurrentInlineStyle();
      const prevStyle = this.state.editorState.getCurrentInlineStyle();

      if (currentStyle !== prevStyle) {
        this.props.active({
          bold: currentStyle.has(STYLES.BOLD),
          italic: currentStyle.has(STYLES.ITALIC),
          underline: currentStyle.has(STYLES.UNDERLINE),
        });
      }
    }
    this.setState({editorState});
  }

  handleReturn(k) {
    if (k.altKey || k.metaKey || k.ctrlKey) {
      const message = {
        displayName: this.state.editorState.getCurrentContent().getPlainText(),
        content: stateToHTML(this.state.editorState.getCurrentContent()),
      };

      this.props.send(message);
      // const editorState = clearEditorContent(this.state.editorState);
      this.setState({editorState: EditorState.createEmpty()});

      return 'handled';
    }

    return 'not-handled';
  }

  handleKeyCommand(k, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, k);

    if (newState) {
      this.onChange(newState);

      return 'handled';
    }

    return 'not-handled';
  }

  toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  }

  render() {
    const draftRootClass = classnames('draft-root', {'draft-hidePlaceholder': this.state.hasFocus});

    return (
      <div className={draftRootClass} onClick={this.focus} onKeyPress={this.focus} role="textbox" tabIndex={-1}>
        <Editor
          handleReturn={this.handleReturn}
          handleKeyCommand={this.handleKeyCommand}
          editorState={this.state.editorState}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          placeholder="Write a message here."
          ref={(c) => {
            this.draftEditor = c;
          }}
        />
      </div>
    );
  }
}

Composer.propTypes = {
  send: PropTypes.func.isRequired,
  commands: PropTypes.func,
  active: PropTypes.func,
};

Composer.defaultProps = {
  commands: undefined,
  active: undefined,
};
