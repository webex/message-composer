import React from 'react';
import ReactDOM from 'react-dom';

import MessageComposer from './components/MessageComposer';
import Toolbar from './components/Toolbar';

const mentions = {
  filter: (query) => [],
  renderUser: (user) => null,
}

const mc = <MessageComposer
  mentions={mentions}
  send={(message) => console.log('Sending: ', message)} />;
ReactDOM.render(
  mc,
  document.getElementById("root")
);