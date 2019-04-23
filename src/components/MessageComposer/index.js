import React, {useRef, useState, useEffect} from 'react';
import {TinyEmitter} from 'tiny-emitter';
import PropTypes from 'prop-types';

//import Composer from '../Composer';
import Composer from '../ComposerSlate'
import Toolbar from '../Toolbar';

import './styles.scss';

const renderToolbar = ({emitter, active}) => (
  <Toolbar emitter={emitter} active={active} />
);

const MessageComposer = ({send, mentions, toolbar, children, draft, setEmitter, notifyKeyDown, placeholder}) => {
  const emitter = useRef(new TinyEmitter());
  const [active, setActive] = useState({});
  
  useEffect(() => {
    setEmitter(emitter.current);
  }, [emitter]);

  const toolbarDom = toolbar({emitter: emitter.current, active});

  return (
    <div className="message-composer-container" >
      <div className="toolbar">{toolbarDom}</div>
      <div className="composer">
        <Composer
          send={send}
          mentions={mentions}
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
  toolbar: renderToolbar,
  setEmitter: () => {},
  notifyKeyDown: null,
  placeholder: '',
};

export default MessageComposer;