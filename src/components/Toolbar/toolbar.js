import React from 'react';
import PropTypes from 'prop-types'

const Toolbar = ({children}) => (<div className='format-toolbar'>{children}</div>);

Toolbar.propTypes = {
  children: PropTypes.node,
}

export default Toolbar;