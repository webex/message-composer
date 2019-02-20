import React from 'react';

//import Composer from '../Composer';
import Composer from '../ComposerSlate'
import Toolbar from '../Toolbar';

import './styles.scss';

class MessageComposer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.setCommands = (c) => { this.commands = c; };
    this.setActive = (active) => this.setState({active});

    this.proxy = {
      toggleBold: () => this.commands.toggleBold(),
      toggleItalic: () => this.commands.toggleItalic(),
      toggleUnderline: () => this.commands.toggleUnderline(),
      toggleCode: () => this.commands.toggleCode(),
    }

    this.state = {
      active: {}
    };
  }

  render() {
    return (<div className="message-composer-container" >
      <Toolbar toggle={this.proxy} active={this.state.active} />
      <hr className="message-composer"/>
      <div className="message-composer-composer">
        <Composer
          send={this.props.send}
          mentions={this.props.mentions}
          commands={this.setCommands}
          active={this.setActive} />
      </div>
    </div>)
  }
}

export default MessageComposer;