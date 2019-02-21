import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import MessageComposer from './components/MessageComposer';
import Toolbar from './components/Toolbar';

const mentions = {
  filter: (query) => [],
  renderUser: (user) => null,
}

const Example = (props) => {
  const [message, setMessage] = useState('');

  return (<div>
    <MessageComposer
      mentions={mentions}
      send={(message) => setMessage(message)} />
    <br/>
    <div>Sending: {JSON.stringify(message)}</div>
  </div>)
}

ReactDOM.render(
  <Example />,
  document.getElementById("root")
);