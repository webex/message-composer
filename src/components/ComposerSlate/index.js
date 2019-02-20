import classnames from 'classnames';
import produce from 'immer';
import React, {Component} from 'react';
import {Editor} from 'slate-react';
import {Value} from 'slate';

import {Bold, Italic, Underline, Code} from './marks';
import ToggleMarks from './toggle-marks';
import RenderPlugin from './render-marks';
import SerializePlugin from './serialize-html';

import './styles.scss';

const STYLE = {
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  CODE: 'code',
};

const InitialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: '',
              },
            ],
          },
        ],
      },
    ],
  },
});

const plugins = [
  ToggleMarks({
    'b': STYLE.BOLD,
    'i': STYLE.ITALIC,
    'u': STYLE.UNDERLINE,
  }),
  RenderPlugin({
    marks: {
      [STYLE.BOLD]: Bold,
      [STYLE.ITALIC]: Italic,
      [STYLE.UNDERLINE]: Underline,
      [STYLE.CODE]: Code,
    },
    nodes: {
    },
  }),
  SerializePlugin(InitialValue),
];

class ComposerSlate extends Component {
  constructor(props) {
    super(props);

    this.focus = () => this.editor.focus();
    this.setEditor = (e) => { this.editor = e; };
    
    this.onChange =this.onChange.bind(this);
    this.toggleStyle = this.toggleStyle.bind(this);
    this.toggleNode = this.toggleNode.bind(this);

    this.state = {
      value: InitialValue,
    };
    this.activeStates = {};
  }

  componentDidMount() {
    if (this.props.commands) {
      this.props.commands({
        toggleBold: () => this.toggleStyle(STYLE.BOLD),
        toggleItalic: () => this.toggleStyle(STYLE.ITALIC),
        toggleUnderline: () => this.toggleStyle(STYLE.UNDERLINE),
        toggleCode: () => this.toggleStyle(STYLE.CODE),
      })
    }
  }

  toggleStyle(type) {
    this.editor.toggleMark(type)
  }

  toggleNode(type) {
    const isType = this.editor.value.blocks.some(block => block.type == type);
    this.editor.setBlocks(isType ? 'paragraph' : type);
  }

  onChange({value}) {
    if (this.props.active) {
      this.activeStates = produce(this.activeStates, states => {
        states.bold = value.activeMarks.some(mark => mark.type === STYLE.BOLD);
        states.italic = value.activeMarks.some(mark => mark.type === STYLE.ITALIC);
        states.underline = value.activeMarks.some(mark => mark.type === STYLE.UNDERLINE);
        states.code = value.activeMarks.some(mark => mark.type === STYLE.CODE);
      })
      this.props.active(this.activeStates);
    }
    this.setState({value});
  }

  render() {
    const draftRootClass = classnames('draft-root', {'draft-hidePlaceholder': this.state.hasFocus});

    return (
      <div className={draftRootClass} onClick={this.focus} onKeyPress={this.focus} role="textbox" tabIndex={-1}>
        <Editor
          value={this.state.value}
          onChange={this.onChange}
          placeholder="Write a message here."
          plugins={plugins}
          ref={this.setEditor}
          send={this.props.send}
        />
      </div>
    );
  }
}

export default ComposerSlate;