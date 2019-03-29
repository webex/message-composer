import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import MessageComposer from './components/MessageComposer';
import Toolbar from './components/Toolbar';

import './styles.scss';

let ids = 1;
const users = [{
  id: 'all',
  displayName: 'All',
  objectType: 'groupMention',
},{
  id: ids++,
  displayName: 'Philip Fry',
  objectType: 'person',
},{
  id: ids++,
  displayName: 'Turanga Leela',
  objectType: 'person',
},{
  id: ids++,
  displayName: 'Hubert Farnsworth',
  objectType: 'person',
},{
  id: ids++,
  displayName: 'Zapp Brannigan',
  objectType: 'person',
},{
  id: ids++,
  displayName: 'John Zoidberg',
  objectType: 'person',
},{
  id: ids++,
  displayName: 'Amy Wang',
  objectType: 'person',
},{
  id: ids++,
  displayName: 'Bender Rodriguez',
  objectType: 'person',
},{
  id: ids++,
  displayName: 'Hermes Conrad',
  objectType: 'person',
},{
  id: ids++,
  displayName: 'Kif Kroker',
  objectType: 'person',
},];

const mentions = {
  filter: (query) => {
    return users.filter((user) => user.displayName.toLowerCase().startsWith(query));
  },
  renderUser: (user, {active}) => {
    const style = active ? {color: 'darkblue'} : null;
    return {
      key: user.id,
      render: (<div style={style}>{user.displayName}</div>),
    };
  },
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