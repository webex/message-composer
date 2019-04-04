import React, {useRef, useState} from 'react';
import {TinyEmitter} from 'tiny-emitter';
import PropTypes from 'prop-types';

//import Composer from '../Composer';
import Composer from '../ComposerSlate'
import Toolbar from '../Toolbar';

import './styles.scss';

const renderToolbar = ({emitter, active}) => (
  <Toolbar emitter={emitter} active={active} />
);

const MessageComposer = ({send, mentions, toolbar, children, draft}) => {
  const emitter = useRef(new TinyEmitter());
  const [active, setActive] = useState({});

  const toolbarDom = toolbar({emitter: emitter.current, active});

  return (
    <div className="message-composer-container" >
      <div className="toolbar">{toolbarDom}</div>
      <hr className="message-composer"/>
      <div className="composer">
        <Composer
          send={send}
          mentions={mentions}
          draft={draft}
          emitter={emitter.current}
          active={setActive} />
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
};

MessageComposer.defaultProps = {
  toolbar: renderToolbar,
};

export default MessageComposer;