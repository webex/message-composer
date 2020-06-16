import React, {useRef, useState, useEffect} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {TinyEmitter} from 'tiny-emitter';

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
  onMentionOpen,
  onMentionClose,
  placeholder,
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

  return (
    <div className={containerClasses}>
      <div className="toolbar" id="toolbar">
        {toolbarDom}
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="composer">
        <QuillComposer
          send={send}
          markdown={markdown}
          mentions={mentions}
          disabled={disabled}
          draft={draft}
          emitter={emitter.current}
          active={setActive}
          notifyKeyDown={notifyKeyDown}
          onMentionOpen={onMentionOpen}
          onMentionClose={onMentionClose}
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
  disabled: PropTypes.bool,
  draft: PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.string,
    save: PropTypes.func,
  }),
  keyBindings: PropTypes.object,
  markdown: PropTypes.shape({
    disabled: PropTypes.bool,
  }),
  mentions: PropTypes.shape({
    participants: PropTypes.object,
  }),
  notifyKeyDown: PropTypes.func,
  onMentionClose: PropTypes.func,
  onMentionOpen: PropTypes.func,
  onError: PropTypes.func,
  placeholder: PropTypes.string,
  send: PropTypes.func,
  setEmitter: PropTypes.func,
  Toolbar: PropTypes.func,
};

MessageComposer.defaultProps = {
  children: undefined,
  disabled: false,
  draft: undefined,
  keyBindings: undefined,
  markdown: undefined,
  mentions: undefined,
  notifyKeyDown: null,
  onMentionClose: undefined,
  onMentionOpen: undefined,
  onError: undefined,
  placeholder: '',
  send: undefined,
  setEmitter: () => {},
  Toolbar: CreateToolbar,
};

export default MessageComposer;
