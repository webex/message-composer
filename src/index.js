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
  displayName: 'Philip Fry',
},{
  displayName: 'Turanga Leela',
},{
  displayName: 'Hubert Farnsworth',
},{
  displayName: 'Zapp Brannigan',
},{
  displayName: 'John Zoidberg',
},{
  displayName: 'Amy Wang',
},{
  displayName: 'Bender Rodriguez',
},{
  displayName: 'Hermes Conrad',
},{
  displayName: 'Kif Kroker',
},{
  displayName: 'Barbados Slim',
},{
  displayName: 'Bill McNeal',
},];

for (const user of users) {
  if (!user.id) {
    user.id = ids++;
  }
  if (!user.objectType) {
    user.objectType = 'person';
  }
}

const mentions = {
  filter: (query) => {
    if (query === '') {
      return users;
    }
    return users.filter((user) => user.displayName.toLowerCase().startsWith(query));
  },
  renderUser: (user, {active}) => {
    const style = active ? {backgroundColor: 'lightblue'} : null;
    return {
      key: user.id,
      render: (<div style={style}>{user.displayName}</div>),
    };
  },
}

const spaces = [];
const setValue = (v, num) => {
  spaces[num] = v;
};

const Example = (props) => {
  const [message, setMessage] = useState('');
  const [number, setNumber] = useState(1);

  const show = (num) => {
    setMessage('');
    setNumber(num);
  };

  const other = (number === 1) ? 2 : 1;

  const draft = {
    id: number,
    value: spaces[number],
    save: setValue,
  };

  return (
    <div className='container'>
      <div className='content' />
      <div className='mc'>
        <MessageComposer
          draft={draft}
          mentions={mentions}
          send={(message) => setMessage(message)} />
        <br/>
        <div>Sending: {JSON.stringify(message)}</div>
        <button onClick={() => show(other)}>Show Space {other}</button>
      </div>
    </div>
  );
}

ReactDOM.render(
  <Example />,
  document.getElementById("root")
);