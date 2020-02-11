import React from 'react';
import PropTypes from 'prop-types';

const ComposerCrash = ({containerClasses, resetError}) => (
  <div className={containerClasses}>
    <div className="error-title">Oops, the message composer broke</div>
    <div className="error-message">Please try clicking reload below or refresh the app</div>
    <div className="error-reload">
      <button className="reload-button" onClick={resetError}>
        Reload
      </button>
    </div>
  </div>
);

ComposerCrash.displayName = 'ComposerCrash';

ComposerCrash.propTypes = {
  containerClasses: PropTypes.string,
  resetError: PropTypes.func,
};

ComposerCrash.defaultProps = {
  containerClasses: '',
  resetError: undefined,
};

export default ComposerCrash;
