import React, { useRef, useState, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { TinyEmitter } from 'tiny-emitter'; //import Composer from '../Composer';

import Composer from '../ComposerSlate';
import ToolbarDefault from '../Toolbar';
import './styles.scss';

const CreateToolbar = ({
  emitter,
  active,
  disabled
}) => React.createElement(ToolbarDefault, {
  emitter: emitter,
  active: active,
  disabled: disabled
});

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
  placeholder
}) => {
  const emitter = useRef(new TinyEmitter());
  const [active, setActive] = useState({});
  useEffect(() => {
    setEmitter(emitter.current);
  }, [emitter]);

  const focus = () => emitter.current.emit('FOCUS');

  const toolbarDom = React.createElement(Toolbar, {
    emitter: emitter.current,
    active: active,
    disabled: disabled
  });
  const containerClasses = classnames('message-composer-container', {
    disabled
  });
  return React.createElement("div", {
    className: containerClasses
  }, React.createElement("div", {
    className: "toolbar"
  }, toolbarDom), React.createElement("div", {
    className: "composer",
    onClick: focus
  }, React.createElement(Composer, {
    send: send,
    markdown: markdown,
    mentions: mentions,
    disabled: disabled,
    draft: draft,
    emitter: emitter.current,
    active: setActive,
    notifyKeyDown: notifyKeyDown,
    placeholder: placeholder
  })), React.createElement("div", {
    className: "children"
  }, children));
};

MessageComposer.propTypes = {
  disabled: PropTypes.bool,
  draft: PropTypes.shape({
    id: PropTypes.any,
    value: PropTypes.object,
    save: PropTypes.func
  }),
  Toolbar: PropTypes.func,
  setEmitter: PropTypes.func,
  notifyKeyDown: PropTypes.func,
  placeholder: PropTypes.string
};
MessageComposer.defaultProps = {
  disabled: false,
  Toolbar: CreateToolbar,
  setEmitter: () => {},
  notifyKeyDown: null,
  placeholder: ''
};
export default MessageComposer;