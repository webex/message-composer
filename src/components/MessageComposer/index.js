import React, {useRef, useState} from 'react';
import {TinyEmitter} from 'tiny-emitter';

//import Composer from '../Composer';
import Composer from '../ComposerSlate'
import Toolbar from '../Toolbar';

import './styles.scss';

const MessageComposer = (props) => {
  const emitter = useRef(new TinyEmitter());
  const [active, setActive] = useState({});

  return (
    <div className="message-composer-container" >
      <Toolbar emitter={emitter.current} active={active} />
      <hr className="message-composer"/>
      <div className="message-composer-composer">
        <Composer
          send={props.send}
          mentions={props.mentions}
          emitter={emitter.current}
          active={setActive} />
      </div>
    </div>
  );
};

export default MessageComposer;