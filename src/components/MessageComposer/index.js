import React, {useRef, useState, useEffect} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {TinyEmitter} from 'tiny-emitter';

import SlateComposer from '../ComposerSlate';
import QuillComposer from '../ComposerQuill';
import ToolbarDefault from '../Toolbar';

import './styles.scss';

const CreateToolbar = ({emitter, active, disabled}) => (
  <ToolbarDefault emitter={emitter} active={active} disabled={disabled} />
);

CreateToolbar.propTypes = {
  emitter: PropTypes.shape({
    on: PropTypes.func,
    off: PropTypes.func,
    emit: PropTypes.func,
  }).isRequired,
  active: PropTypes.shape({
    bold: PropTypes.bool,
    italic: PropTypes.bool,
    underline: PropTypes.bool,
    code: PropTypes.bool,
  }),
  disabled: PropTypes.bool,
};

CreateToolbar.defaultProps = {
  disabled: false,
  active: undefined,
};

const MessageComposer = ({
  send,
  markdown,
  mentions,
  Toolbar,
  children,
  disabled,
  draft,
  setEmitter,
  notifyKeyDown,
  placeholder,
  composerType,
}) => {
  const emitter = useRef(new TinyEmitter());
  const [active, setActive] = useState({});

  useEffect(() => {
    setEmitter(emitter.current);
  }, [emitter, setEmitter]);

  const focus = () => emitter.current.emit('FOCUS');

  const toolbarDom = <Toolbar emitter={emitter.current} active={active} disabled={disabled} />;

  const containerClasses = classnames('message-composer-container', {disabled});
  let composerClasses = 'composer';

  let Composer;

  switch (composerType) {
    default:
    case 'slate': {
      Composer = SlateComposer;
      composerClasses += ' slate';
      break;
    }
    case 'quill': {
      Composer = QuillComposer;
      break;
    }
  }

  return (
    <div className={containerClasses}>
      <div className="toolbar" id="toolbar">
        {toolbarDom}
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={composerClasses} onClick={focus}>
        <Composer
          send={send}
          markdown={markdown}
          mentions={mentions}
          disabled={disabled}
          draft={draft}
          emitter={emitter.current}
          active={setActive}
          notifyKeyDown={notifyKeyDown}
          placeholder={placeholder}
        />
      </div>
      <div className="children">{children}</div>
    </div>
  );
};

MessageComposer.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  draft: PropTypes.shape({
    id: PropTypes.any,
    value: PropTypes.object,
    save: PropTypes.func,
  }),
  markdown: PropTypes.shape({
    disabled: PropTypes.bool,
  }),
  mentions: PropTypes.shape({
    filter: PropTypes.func,
    renderSuggestion: PropTypes.func,
  }),
  Toolbar: PropTypes.func,
  setEmitter: PropTypes.func,
  notifyKeyDown: PropTypes.func,
  send: PropTypes.func,
  placeholder: PropTypes.string,
  composerType: PropTypes.oneOf(['slate', 'quill']),
};

MessageComposer.defaultProps = {
  children: undefined,
  disabled: false,
  draft: undefined,
  Toolbar: CreateToolbar,
  setEmitter: () => {},
  markdown: undefined,
  mentions: undefined,
  notifyKeyDown: null,
  send: undefined,
  placeholder: '',
  composerType: 'slate',
};

export default MessageComposer;
