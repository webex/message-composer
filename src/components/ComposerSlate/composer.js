import classnames from 'classnames';
import produce from 'immer';
import PropTypes from 'prop-types';
import React, {useCallback, useRef, useState, useEffect} from 'react';
import {Editor} from 'slate-react';
import {Value} from 'slate';

import MarkDownPlugin from '../../plugins/markdown';
import Mentions from '../../plugins/mentions';

import {Bold, Italic, Underline, Code, H1, H2, H3} from './marks';
import ToggleMarks from './toggle-marks';
import RenderPlugin from './render-marks';
import SendMessagePlugin from './send-message';

import './styles.scss';

const {markMention, Plugin: MentionsPlugin} = Mentions();

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
    b: STYLE.BOLD,
    i: STYLE.ITALIC,
    u: STYLE.UNDERLINE,
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

const Composer = ({emitter, active, markdown, mentions, send, disabled, draft, notifyKeyDown, placeholder}) => {
  const editor = useRef(null);

  const focus = () => editor.current.focus();

  const insert = (s) => editor.current.insertText(s);

  const toggleStyle = (type) => {
    editor.current.toggleMark(type);
  };
  const toggleNode = (type) => {
    const isType = editor.current.value.blocks.some((block) => block.type === type);

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

    emitter.on('SEND', () => editor.current.sendMessage());
    emitter.on('CLEAR', () => editor.current.clearMessage());

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

      emitter.off('SEND');
      emitter.off('CLEAR');
    };
  }, [emitter]);

  const activeStates = useRef({});
  const updateActiveStates = useCallback(
    (value) => {
      if (active) {
        activeStates.current = produce(activeStates.current, (states) => {
          /* eslint-disable no-param-reassign */
          states.bold = value.activeMarks.some((mark) => mark.type === STYLE.BOLD);
          states.italic = value.activeMarks.some((mark) => mark.type === STYLE.ITALIC);
          states.underline = value.activeMarks.some((mark) => mark.type === STYLE.UNDERLINE);
          states.code = value.activeMarks.some((mark) => mark.type === STYLE.CODE);

          states.normal = value.blocks.some((block) => block.type === 'paragraph');
          states.h1 = value.blocks.some((block) => block.type === 'h1');
          states.h2 = value.blocks.some((block) => block.type === 'h2');
          states.h3 = value.blocks.some((block) => block.type === 'h3');
          /* eslint-enable no-param-reassign */
        });
        active(activeStates.current);
      }
    },
    [active]
  );

  const [value, setValue] = useState(InitialValue);
  const onChange = useCallback(
    (event) => {
      const val = event.value;

      updateActiveStates(val);
      setValue(val);
    },
    [updateActiveStates]
  );

  useEffect(() => {
    if (draft.value) {
      onChange({value: draft.value});
    } else {
      onChange({value: InitialValue});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.id]);
  useEffect(() => {
    if (draft.save) {
      draft.save(value, draft.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const val = markMention(editor.current);

    if (val) {
      onChange({value: val});
    }
  });

  // Slate won't update placeholder until text has been inserted and deleted.
  // TODO: Remove this when Slate is fixed
  useEffect(() => {
    setTimeout(() => editor.current.insertText('a').deleteBackward(1));
  }, [placeholder]);

  const draftRootClass = classnames('draft-root', {disabled});

  return (
    <div className={draftRootClass} onClick={focus} onKeyPress={focus} role="textbox" tabIndex={-1}>
      <Editor
        className="composer-editable"
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
        emitter={emitter}
      />
    </div>
  );
};

Composer.propTypes = {
  active: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
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
  markdown: PropTypes.shape({
    disabled: PropTypes.bool,
  }),
  mentions: PropTypes.shape({
    filter: PropTypes.func,
    renderSuggestion: PropTypes.func,
  }),
  notifyKeyDown: PropTypes.func,
  send: PropTypes.func,
  placeholder: PropTypes.string,
};

Composer.defaultProps = {
  disabled: false,
  draft: {},
  markdown: {
    disabled: false,
  },
  mentions: undefined,
  notifyKeyDown: null,
  send: undefined,
  placeholder: '',
};

export default React.memo(Composer);
