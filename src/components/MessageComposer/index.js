import React, {useRef, useState, useEffect} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {TinyEmitter} from 'tiny-emitter';

//import Composer from '../Composer';
import Composer from '../ComposerSlate'
import Toolbar from '../Toolbar';

import './styles.scss';

const renderToolbar = ({emitter, active, disabled}) => (
  <Toolbar emitter={emitter} active={active} disabled={disabled} />
);

const MessageComposer = ({send, mentions, toolbar, children, disabled, draft, setEmitter, notifyKeyDown, placeholder}) => {
  const emitter = useRef(new TinyEmitter());
  const [active, setActive] = useState({});
  
  useEffect(() => {
    setEmitter(emitter.current);
  }, [emitter]);

  const toolbarDom = toolbar({emitter: emitter.current, active, disabled});

  const containerClasses = classnames('message-composer-container', {disabled});
  return (
    <div className={containerClasses} >
      <div className="toolbar">{toolbarDom}</div>
      <div className="composer">
        <Composer
          send={send}
          mentions={mentions}
          disabled={disabled}
          draft={draft}
          emitter={emitter.current}
          active={setActive}
          notifyKeyDown={notifyKeyDown}
          placeholder={placeholder}
        />
      </div>
      <div className="children">
        {children}
      </div>
    </div>
  );
};

MessageComposer.propTypes = {
  disabled: PropTypes.bool,
  draft: PropTypes.shape({
    id: PropTypes.any,
    value: PropTypes.object,
    save: PropTypes.func,
  }),
  toolbar: PropTypes.func,
  setEmitter: PropTypes.func,
  notifyKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
};

MessageComposer.defaultProps = {
  disabled: false,
  toolbar: renderToolbar,
  setEmitter: () => {},
  notifyKeyDown: null,
  placeholder: '',
};

export default MessageComposer;