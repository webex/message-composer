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

const FormatToolbar = React.memo(({active, emitter}) => {
  const toggle = (type) => (e) => {
    e.preventDefault();
    emitter.emit(type);
  }

  const boldClass = classnames('toolbar-button','bold', {active: active && active.bold});
  const italicClass = classnames('toolbar-button','italic', {active: active && active.italic});
  const ulClass = classnames('toolbar-button','underline', {active: active && active.underline});
  const codeClass = classnames('toolbar-button','code', {active: active && active.code});
  return (<Toolbar>
    <button className={boldClass} onPointerDown={toggle('toggleBold')}>
      <Icon size={ICON_SIZE} icon={bold} />
    </button>
    <button className={italicClass} onPointerDown={toggle('toggleItalic')}>
      <Icon size={ICON_SIZE} icon={italic} />
    </button>
    <button className={ulClass} onPointerDown={toggle('toggleUnderline')}>
      <Icon size={ICON_SIZE} icon={underline} />
    </button>
    <button className={codeClass} onPointerDown={toggle('toggleCode')}>
      <Icon size={ICON_SIZE} icon={code} />
    </button>
  </Toolbar>);
});

export default FormatToolbar;