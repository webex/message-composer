import React, {useMemo, useState, useRef} from 'react';
import ReactDOM from 'react-dom';

import MessageComposer from './components/MessageComposer';

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
  filter: (query) =>
    Promise.resolve(
      (query === '') ? users : users.filter((user) => user.displayName.toLowerCase().startsWith(query.toLowerCase()))
    ),
  renderSuggestion: (user, {active}) => {
    const activeStyle = active ? {backgroundColor: 'lightblue'} : null;
    const style = {
      ...activeStyle,
      height: '30px',
      width: '200px',
    };
    return {
      key: user.id,
      render: (<div style={style}>{user.displayName}</div>),
    };
  },
  renderInsert: (user) => {
    const style = {background: 'lightblue'};
    const text = (user.objectType === 'person') ? user.displayName.split(' ')[0] : user.displayName;
    return <b style={style}>{text}</b>;
  },
  getDisplay: (user) => {
    return (user.objectType === 'person') ? user.displayName.split(' ')[0] : user.displayName;
  },
}

const spaces = [];
const setValue = (v, num) => {
  spaces[num] = v;
};

export default {
  component: MessageComposer,
  title: 'MessageComposer'
}

export const Example = (props) => {
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

  const emitter = useRef();
  const setEmitter = (e) => {
    emitter.current = e;
  };

  const focus = (e) => {
    e.preventDefault();
    emitter.current.emit('FOCUS');
  };

  const insertText = (t) => (e) => {
    e.preventDefault();
    emitter.current.emit('INSERT_TEXT', t);
  }

  const send = (e) => {
    e.preventDefault();
    emitter.current.emit('SEND');
  }

  const notifyKeyDown = (event) => {
    console.log('Key pressed', event);
  }

  const [disabled, setDisabled] = useState(false);
  const toggleDisabled = () => {
    setDisabled(!disabled);
  }

  const [isMarkdownDisabled, setMarkdownDisabled] = useState(false);
  const toggleMarkdownDisabled = () => {
    setMarkdownDisabled(!isMarkdownDisabled);
  };

  const [placeholder, setPlaceholder] = useState('Write your message in this space.');
  const changePlaceholder = () => {
    setPlaceholder('This is a new placeholder');
  };

  const markdown = useMemo(() => ({
    disabled: isMarkdownDisabled,
  }), [isMarkdownDisabled]);

  return (
    <div className='container'>
      <div className='content' onClick={focus} />
      <div className='mc'>
        <MessageComposer
          disabled={disabled}
          draft={draft}
          markdown={markdown}
          mentions={mentions}
          send={(message) => setMessage(message)}
          notifyKeyDown={notifyKeyDown}
          placeholder={placeholder}
          setEmitter={setEmitter} />
        <br/>
        <div>Sending: {JSON.stringify(message)}</div>
        <button onClick={() => show(other)}>Show Space {other}</button>
        <button onClick={insertText('🎉')}>Insert Emoji</button>
        <button onClick={insertText('@')}>@Mention</button>
        <button onClick={toggleDisabled}>{(disabled) ? 'enable' : 'disable'}</button>
        <button onClick={toggleMarkdownDisabled}>{(isMarkdownDisabled) ? 'enable markdown' : 'disable markdown'}</button>
        <button onClick={send}>SEND</button>
        <button onClick={changePlaceholder}>Change placeholder</button>
      </div>
    </div>
  );
}