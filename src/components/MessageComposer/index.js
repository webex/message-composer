import React, {useRef, useState} from 'react';

//import Composer from '../Composer';
import Composer from '../ComposerSlate'
import Toolbar from '../Toolbar';

import './styles.scss';

const MessageComposer = (props) => {
  const commands = useRef(null);
  const setCommands = (c) => { commands.current = c; };

  const [active, setActive] = useState({});

  const proxy = {
    toggleBold: () => commands.current.toggleBold(),
    toggleItalic: () => commands.current.toggleItalic(),
    toggleUnderline: () => commands.current.toggleUnderline(),
    toggleCode: () => commands.current.toggleCode(),
  }

  return (
    <div className="message-composer-container" >
      <Toolbar toggle={proxy} active={active} />
      <hr className="message-composer"/>
      <div className="message-composer-composer">
        <Composer
          send={props.send}
          mentions={props.mentions}
          commands={setCommands}
          active={setActive} />
      </div>
    </div>
  );
};

export default MessageComposer;