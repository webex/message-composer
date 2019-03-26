import classnames from 'classnames';
import produce from 'immer';
import React, {Component, useRef, useState, useEffect} from 'react';
import {Editor} from 'slate-react';
import {Value} from 'slate';

import {Bold, Italic, Underline, Code} from './marks';
import ToggleMarks from './toggle-marks';
import RenderPlugin from './render-marks';
import SendMessagePlugin from './send-message';

import MarkDownPlugin from '../../plugins/markdown';
import Mentions from '../../plugins/mentions';

const {markMention, Plugin: MentionsPlugin} = Mentions();

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
  SendMessagePlugin(InitialValue),
  MarkDownPlugin(),
  MentionsPlugin(),
];

const Composer = (props) => {
  const editor = useRef(null);
  
  const focus = () => editor.current.focus();
  
  const toggleStyle = (type) => {
    editor.current.toggleMark(type)
  };
  const toggleNode = (type) => {
    const isType = editor.current.value.blocks.some(block => block.type == type);
    editor.current.setBlocks(isType ? 'paragraph' : type);
  };
  useEffect(() => {
    props.emitter.on('toggleBold', () => toggleStyle(STYLE.BOLD));
    props.emitter.on('toggleItalic', () => toggleStyle(STYLE.ITALIC));
    props.emitter.on('toggleUnderline', () => toggleStyle(STYLE.UNDERLINE));
    props.emitter.on('toggleCode', () => toggleStyle(STYLE.CODE));

    return () => {
      props.emitter.off('toggleBold');
      props.emitter.off('toggleItalic');
      props.emitter.off('toggleUnderline');
      props.emitter.off('toggleCode');
    }
  }, [props.emitter]);
  
  const activeStates = useRef({});
  const updateActiveStates = (value) => {
    if (props.active) {
      activeStates.current = produce(activeStates.current, states => {
        states.bold = value.activeMarks.some(mark => mark.type === STYLE.BOLD);
        states.italic = value.activeMarks.some(mark => mark.type === STYLE.ITALIC);
        states.underline = value.activeMarks.some(mark => mark.type === STYLE.UNDERLINE);
        states.code = value.activeMarks.some(mark => mark.type === STYLE.CODE);
      })
      props.active(activeStates.current);
    }
  }

  const [value, setValue] = useState(InitialValue);
  const onChange = ({value}) => {
    updateActiveStates(value);
    setValue(value);
  };

  useEffect(() => {
    markMention(editor.current);
  });

  const draftRootClass = classnames('draft-root');
  return (
    <div className={draftRootClass} onClick={focus} onKeyPress={focus} role="textbox" tabIndex={-1}>
      <Editor
        value={value}
        onChange={onChange}
        placeholder="Write a message here."
        plugins={plugins}
        ref={editor}
        send={props.send}
        mentions={props.mentions}
      />
    </div>
  );
}

export default Composer;