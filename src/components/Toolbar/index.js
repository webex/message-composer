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

const FormatToolbar = (props) => {
  const toggle = (type) => (e) => {
    e.preventDefault();
    props.toggle[type]();
  }

  const boldClass = classnames('toolbar', 'bold', {active: props.active && props.active.bold});
  const italicClass = classnames('toolbar', 'italic', {active: props.active && props.active.italic});
  const ulClass = classnames('toolbar', 'underline', {active: props.active && props.active.underline});
  const codeClass = classnames('toolbar', 'code', {active: props.active && props.active.code});
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
};

export default FormatToolbar;