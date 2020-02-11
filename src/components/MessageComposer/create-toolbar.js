import React from 'react';
import PropTypes from 'prop-types';

import ToolbarDefault from '../Toolbar';

const CreateToolbar = ({emitter, active, disabled}) => (
  <ToolbarDefault emitter={emitter} active={active} disabled={disabled} />
);

CreateToolbar.displayName = 'CreateToolbar';

CreateToolbar.propTypes = {
  emitter: PropTypes.shape({
    on: PropTypes.func,
    off: PropTypes.func,
    emit: PropTypes.func,
  }).isRequired,
  active: PropTypes.shape({
    bold: PropTypes.bool,
    italic: PropTypes.bool,
    underline: PropTypes.bool,
    code: PropTypes.bool,
  }),
  disabled: PropTypes.bool,
};

CreateToolbar.defaultProps = {
  disabled: false,
  active: undefined,
};

export default CreateToolbar;
