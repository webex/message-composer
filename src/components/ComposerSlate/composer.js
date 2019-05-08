import classnames from 'classnames';
import produce from 'immer';
import PropTypes from 'prop-types';
import React, {Component, useRef, useState, useEffect} from 'react';
import {Editor} from 'slate-react';
import {Value} from 'slate';

import {Bold, Italic, Underline, Code, H1, H2, H3} from './marks';
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

  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  NORMAL: 'paragraph',
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
      [STYLE.H1]: H1,
      [STYLE.H2]: H2,
      [STYLE.H3]: H3,
    },
  }),
  MarkDownPlugin(),
  MentionsPlugin(),
  SendMessagePlugin(InitialValue),
];

const Composer = ({
  emitter, active, markdown, mentions, send,
  disabled, draft, notifyKeyDown, placeholder,
}) => {
  const editor = useRef(null);
  
  const focus = () => editor.current.focus();

  const insert = (s) => editor.current.insertText(s);
  
  const toggleStyle = (type) => {
    editor.current.toggleMark(type)
  };
  const toggleNode = (type) => {
    const isType = editor.current.value.blocks.some(block => block.type == type);
    editor.current.setBlocks(isType ? 'paragraph' : type);
  };
  useEffect(() => {
    emitter.on('toggleBold', () => toggleStyle(STYLE.BOLD));
    emitter.on('toggleItalic', () => toggleStyle(STYLE.ITALIC));
    emitter.on('toggleUnderline', () => toggleStyle(STYLE.UNDERLINE));
    emitter.on('toggleCode', () => toggleStyle(STYLE.CODE));

    emitter.on('toggleNormal', () => toggleNode(STYLE.NORMAL));
    emitter.on('toggleH1', () => toggleNode(STYLE.H1));
    emitter.on('toggleH2', () => toggleNode(STYLE.H2));
    emitter.on('toggleH3', () => toggleNode(STYLE.H3));

    emitter.on('FOCUS', focus);
    emitter.on('INSERT_TEXT', insert);

    return () => {
      emitter.off('toggleBold');
      emitter.off('toggleItalic');
      emitter.off('toggleUnderline');
      emitter.off('toggleCode');

      emitter.off('toggleNormal');
      emitter.off('toggleH1');
      emitter.off('toggleH2');
      emitter.off('toggleH3');

      emitter.off('FOCUS', focus);
      emitter.off('INSERT_TEXT', insert);
    }
  }, [emitter]);
  
  const activeStates = useRef({});
  const updateActiveStates = (value) => {
    if (active) {
      activeStates.current = produce(activeStates.current, states => {
        states.bold = value.activeMarks.some(mark => mark.type === STYLE.BOLD);
        states.italic = value.activeMarks.some(mark => mark.type === STYLE.ITALIC);
        states.underline = value.activeMarks.some(mark => mark.type === STYLE.UNDERLINE);
        states.code = value.activeMarks.some(mark => mark.type === STYLE.CODE);

        states.normal = value.blocks.some(block => block.type === 'paragraph');
        states.h1 = value.blocks.some(block => block.type === 'h1');
        states.h2 = value.blocks.some(block => block.type === 'h2');
        states.h3 = value.blocks.some(block => block.type === 'h3');
      })
      active(activeStates.current);
    }
  }

  const [value, setValue] = useState(InitialValue);
  const onChange = ({value}) => {
    updateActiveStates(value);
    setValue(value);
  };
  useEffect(() => {
    if (draft.value) {
      onChange({value: draft.value});
    }
    else {
      onChange({value: InitialValue});
    }
  }, [draft.id]);
  useEffect(() => {
    if (draft.save) {
      draft.save(value, draft.id);
    }
  }, [value]);

  useEffect(() => {
    const value = markMention(editor.current);
    if (value) {
      onChange({value});
    }
  });

  const draftRootClass = classnames('draft-root', {disabled});
  return (
    <div className={draftRootClass} onClick={focus} onKeyPress={focus} role="textbox" tabIndex={-1}>
      <Editor
        value={value}
        notifyKeyDown={notifyKeyDown}
        onChange={onChange}
        placeholder={placeholder}
        plugins={plugins}
        readOnly={disabled}
        ref={editor}
        send={send}
        markdown={markdown}
        mentions={mentions}
      />
    </div>
  );
};

Composer.propTypes = {
  disabled: PropTypes.bool,
  draft: PropTypes.shape({
    id: PropTypes.any,
    value: PropTypes.object,
    save: PropTypes.func,
  }),
  markdown: PropTypes.shape({
    disabled: PropTypes.bool,
  }),
  notifyKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
};

Composer.defaultProps = {
  disabled: false,
  draft: {},
  markdown: {
    disabled: false,
  },
  notifyKeyDown: null,
  placeholder: '',
}

export default React.memo(Composer);