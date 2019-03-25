import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import MessageComposer from './components/MessageComposer';
import Toolbar from './components/Toolbar';

import './styles.scss';

let ids = 1;
const users = [{
  id: ids++,
  displayName: 'Philip Fry',
},
{
  id: ids++,
  displayName: 'Turanga Leela',
},
{
  id: ids++,
  displayName: 'Hubert Farnsworth',
},
{
  id: ids++,
  displayName: 'Zapp Brannigan',
},
{
  id: ids++,
  displayName: 'John Zoidberg',
},
{
  id: ids++,
  displayName: 'Amy Wang',
},
{
  id: ids++,
  displayName: 'Bender Rodriguez',
},
{
  id: ids++,
  displayName: 'Hermes Conrad',
},
{
  id: ids++,
  displayName: 'Kif Kroker',
},];

const mentions = {
  filter: (query) => {
    return users.filter((user) => user.displayName.toLowerCase().startsWith(query));
  },
  renderUser: (user) => {
    return {
      key: user.id,
      render: (<div>{user.displayName}</div>),
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