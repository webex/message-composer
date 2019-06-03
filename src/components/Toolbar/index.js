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

const options = {
  normal: 'Normal',
  h1: 'H1',
  h2: 'H2',
  h3: 'H3',
};

const setCurrentHeader = (active) => {
  if (active.normal) return options.normal;
  if (active.h1) return options.h1;
  if (active.h2) return options.h2;
  if (active.h3) return options.h3;
};

const FormatToolbar = React.memo(({active, disabled, emitter}) => {
  const toggle = (type) => (e) => {
    e.preventDefault();
    emitter.emit(type);
  }

  const focus = toggle('FOCUS');

  const toggleStyle = (type) => (e) => {
    emitter.emit(type);
    focus(e);
  }

  const currentHeader = setCurrentHeader(active);
  const toggleHeader = (e) => {
    emitter.emit(`toggle${e.target.value}`);
    focus(e);
  };
  
  const boldClass = classnames('toolbar-button','bold', {active: active && active.bold});
  const italicClass = classnames('toolbar-button','italic', {active: active && active.italic});
  const ulClass = classnames('toolbar-button','underline', {active: active && active.underline});
  const codeClass = classnames('toolbar-button','code', {active: active && active.code});
  return (<Toolbar >
    <button className={boldClass} disabled={disabled} onClick={toggleStyle('toggleBold')}>
      <Icon size={ICON_SIZE} icon={bold} />
    </button>
    <button className={italicClass} disabled={disabled} onClick={toggleStyle('toggleItalic')}>
      <Icon size={ICON_SIZE} icon={italic} />
    </button>
    <button className={ulClass} disabled={disabled} onClick={toggleStyle('toggleUnderline')}>
      <Icon size={ICON_SIZE} icon={underline} />
    </button>
    <button className={codeClass} disabled={disabled} onClick={toggleStyle('toggleCode')}>
      <Icon size={ICON_SIZE} icon={code} />
    </button>
    <select value={currentHeader} disabled={disabled} onChange={toggleHeader}>
      {Object.values(options).map((option) => (<option key={option} value={option}>{option}</option>))}
    </select> 
  </Toolbar>);
});

export default FormatToolbar;