import React, { useMemo, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import MessageComposer from './components/MessageComposer';
import './styles.scss';
let ids = 1;
const users = [{
  id: 'all',
  displayName: 'All',
  objectType: 'groupMention'
}, {
  displayName: 'Philip Fry'
}, {
  displayName: 'Turanga Leela'
}, {
  displayName: 'Hubert Farnsworth'
}, {
  displayName: 'Zapp Brannigan'
}, {
  displayName: 'John Zoidberg'
}, {
  displayName: 'Amy Wang'
}, {
  displayName: 'Bender Rodriguez'
}, {
  displayName: 'Hermes Conrad'
}, {
  displayName: 'Kif Kroker'
}, {
  displayName: 'Barbados Slim'
}, {
  displayName: 'Bill McNeal'
}];

for (const user of users) {
  if (!user.id) {
    user.id = ids++;
  }

  if (!user.objectType) {
    user.objectType = 'person';
  }
}

const mentions = {
  filter: query => Promise.resolve(query === '' ? users : users.filter(user => user.displayName.toLowerCase().startsWith(query.toLowerCase()))),
  renderSuggestion: (user, {
    active
  }) => {
    const activeStyle = active ? {
      backgroundColor: 'lightblue'
    } : null;
    const style = { ...activeStyle,
      height: '30px',
      width: '200px'
    };
    return {
      key: user.id,
      render: React.createElement("div", {
        style: style
      }, user.displayName)
    };
  },
  renderInsert: user => {
    const style = {
      background: 'lightblue'
    };
    const text = user.objectType === 'person' ? user.displayName.split(' ')[0] : user.displayName;
    return React.createElement("b", {
      style: style
    }, text);
  },
  getDisplay: user => {
    return user.objectType === 'person' ? user.displayName.split(' ')[0] : user.displayName;
  }
};
const spaces = [];

const setValue = (v, num) => {
  spaces[num] = v;
};

const Example = props => {
  const [message, setMessage] = useState('');
  const [number, setNumber] = useState(1);

  const show = num => {
    setMessage('');
    setNumber(num);
  };

  const other = number === 1 ? 2 : 1;
  const draft = {
    id: number,
    value: spaces[number],
    save: setValue
  };
  const emitter = useRef();

  const setEmitter = e => {
    emitter.current = e;
  };

  const focus = e => {
    e.preventDefault();
    emitter.current.emit('FOCUS');
  };

  const insertText = t => e => {
    e.preventDefault();
    emitter.current.emit('INSERT_TEXT', t);
  };

  const send = e => {
    e.preventDefault();
    emitter.current.emit('SEND');
  };

  const notifyKeyDown = event => {
    console.log('Key pressed', event);
  };

  const [disabled, setDisabled] = useState(false);

  const toggleDisabled = () => {
    setDisabled(!disabled);
  };

  const [isMarkdownDisabled, setMarkdownDisabled] = useState(false);

  const toggleMarkdownDisabled = () => {
    setMarkdownDisabled(!isMarkdownDisabled);
  };

  const [placeholder, setPlaceholder] = useState('Write your message in this space.');

  const changePlaceholder = () => {
    setPlaceholder('This is a new placeholder');
  };

  const markdown = useMemo(() => ({
    disabled: isMarkdownDisabled
  }), [isMarkdownDisabled]);
  return React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "content",
    onClick: focus
  }), React.createElement("div", {
    className: "mc"
  }, React.createElement(MessageComposer, {
    disabled: disabled,
    draft: draft,
    markdown: markdown,
    mentions: mentions,
    send: message => setMessage(message),
    notifyKeyDown: notifyKeyDown,
    placeholder: placeholder,
    setEmitter: setEmitter
  }), React.createElement("br", null), React.createElement("div", null, "Sending: ", JSON.stringify(message)), React.createElement("button", {
    onClick: () => show(other)
  }, "Show Space ", other), React.createElement("button", {
    onClick: insertText('🎉')
  }, "Insert Emoji"), React.createElement("button", {
    onClick: insertText('@')
  }, "@Mention"), React.createElement("button", {
    onClick: toggleDisabled
  }, disabled ? 'enable' : 'disable'), React.createElement("button", {
    onClick: toggleMarkdownDisabled
  }, isMarkdownDisabled ? 'enable markdown' : 'disable markdown'), React.createElement("button", {
    onClick: send
  }, "SEND"), React.createElement("button", {
    onClick: changePlaceholder
  }, "Change placeholder")));
};

ReactDOM.render(React.createElement(Example, null), document.getElementById("root"));