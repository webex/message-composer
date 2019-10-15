import React from 'react';
import PropTypes from 'prop-types';

const Toolbar = ({
  children
}) => React.createElement("div", {
  className: "format-toolbar"
}, children);

Toolbar.propTypes = {
  children: PropTypes.node
};
export default Toolbar;