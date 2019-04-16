import classnames from 'classnames';
import produce from 'immer';
import PropTypes from 'prop-types';
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
  MarkDownPlugin(),
  MentionsPlugin(),
  SendMessagePlugin(InitialValue),
];

const Composer = React.memo(({emitter, active, mentions, send, draft}) => {
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
    emitter.on('toggleBold', () => toggleStyle(STYLE.BOLD));
    emitter.on('toggleItalic', () => toggleStyle(STYLE.ITALIC));
    emitter.on('toggleUnderline', () => toggleStyle(STYLE.UNDERLINE));
    emitter.on('toggleCode', () => toggleStyle(STYLE.CODE));

    emitter.on('FOCUS', focus);

    return () => {
      emitter.off('toggleBold');
      emitter.off('toggleItalic');
      emitter.off('toggleUnderline');
      emitter.off('toggleCode');

      emitter.off('FOCUS', focus);
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
        send={send}
        mentions={mentions}
      />
    </div>
  );
});

Composer.propTypes = {
  draft: PropTypes.shape({
    id: PropTypes.any,
    value: PropTypes.object,
    save: PropTypes.func,
  }),
};

Composer.defaultProps = {
  draft: {},
}

export default Composer;