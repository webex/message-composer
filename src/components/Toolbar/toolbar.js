import React from 'react';
import PropTypes from 'prop-types'

const Toolbar = ({children, focus}) => (<div className='format-toolbar' onClick={focus}>{children}</div>);

Toolbar.propTypes = {
  children: PropTypes.node,
  focus: PropTypes.func,
}

Toolbar.defaultProps = {
  focus: null,
};

export default Toolbar;