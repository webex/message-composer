import Toolbar from './toolbar';

import classnames from 'classnames';
import React from 'react';
import Icon from 'react-icons-kit';
import {bold} from 'react-icons-kit/feather/bold';
import {italic} from 'react-icons-kit/feather/italic';
import {underline} from 'react-icons-kit/feather/underline';
import {code} from 'react-icons-kit/feather/code';

import './styles.scss';

const ICON_SIZE = 14;

const FormatToolbar = React.memo(({active, disabled, emitter}) => {
  const toggle = (type) => (e) => {
    e.preventDefault();
    emitter.emit(type);
  }

  const focus = toggle('FOCUS');

  const boldClass = classnames('toolbar-button','bold', {active: active && active.bold});
  const italicClass = classnames('toolbar-button','italic', {active: active && active.italic});
  const ulClass = classnames('toolbar-button','underline', {active: active && active.underline});
  const codeClass = classnames('toolbar-button','code', {active: active && active.code});
  return (<Toolbar focus={focus} >
    <button className={boldClass} disabled={disabled} onClick={toggle('toggleBold')}>
      <Icon size={ICON_SIZE} icon={bold} />
    </button>
    <button className={italicClass} disabled={disabled} onClick={toggle('toggleItalic')}>
      <Icon size={ICON_SIZE} icon={italic} />
    </button>
    <button className={ulClass} disabled={disabled} onClick={toggle('toggleUnderline')}>
      <Icon size={ICON_SIZE} icon={underline} />
    </button>
    <button className={codeClass} disabled={disabled} onClick={toggle('toggleCode')}>
      <Icon size={ICON_SIZE} icon={code} />
    </button>
  </Toolbar>);
});

export default FormatToolbar;