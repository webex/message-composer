import React, {useRef, useState, useEffect} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {TinyEmitter} from 'tiny-emitter';

import SlateComposer from '../ComposerSlate';
import QuillComposer from '../ComposerQuill';

import CreateToolbar from './create-toolbar';
import './styles.scss';

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
  onError,
  keyBindings,
}) => {
  const emitter = useRef(new TinyEmitter());
  const [active, setActive] = useState({});

  useEffect(() => {
    setEmitter(emitter.current);
  }, [emitter, setEmitter]);

  const containerClasses = classnames('message-composer-container', {disabled});

  const toolbarDom = <Toolbar emitter={emitter.current} active={active} disabled={disabled} />;

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
      <div className={composerClasses}>
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
          onError={onError}
          keyBindings={keyBindings}
        />
      </div>
      <div className="children">{children}</div>
    </div>
  );
};

MessageComposer.displayName = 'MessageComposer';

MessageComposer.propTypes = {
  children: PropTypes.node,
  composerType: PropTypes.oneOf(['slate', 'quill']),
  disabled: PropTypes.bool,
  draft: PropTypes.shape({
    id: PropTypes.any,
    value: PropTypes.object,
    save: PropTypes.func,
  }),
  keyBindings: PropTypes.object,
  markdown: PropTypes.shape({
    disabled: PropTypes.bool,
  }),
  mentions: PropTypes.shape({
    filter: PropTypes.func,
    renderSuggestion: PropTypes.func,
  }),
  notifyKeyDown: PropTypes.func,
  onError: PropTypes.func,
  placeholder: PropTypes.string,
  send: PropTypes.func,
  setEmitter: PropTypes.func,
  Toolbar: PropTypes.func,
};

MessageComposer.defaultProps = {
  children: undefined,
  composerType: 'slate',
  disabled: false,
  draft: undefined,
  keyBindings: undefined,
  markdown: undefined,
  mentions: undefined,
  notifyKeyDown: null,
  onError: undefined,
  placeholder: '',
  send: undefined,
  setEmitter: () => {},
  Toolbar: CreateToolbar,
};

export default MessageComposer;
