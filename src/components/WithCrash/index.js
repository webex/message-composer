import React from 'react';
import {isFunction} from 'lodash';
import PropTypes from 'prop-types';

const withCrash = (WrappedComponent) => {
  class Crash extends React.Component {
    constructor(props) {
      super(props);

      this.state = {hasError: false};
      this.resetError = this.resetError.bind(this);
    }

    componentDidCatch(error, info) {
      const {onCrash} = this.props;

      if (isFunction(onCrash)) {
        onCrash(error, info);
      }
    }

    static getDerivedStateFromError() {
      // Update state so the next render will show the fallback UI.
      return {hasError: true};
    }

    resetError() {
      this.setState({hasError: false});
    }

    render() {
      const {onCrash, ...otherProps} = this.props;

      return <WrappedComponent {...this.state} {...otherProps} resetError={this.resetError} />;
    }
  }

  Crash.propTypes = {
    onCrash: PropTypes.func,
  };

  Crash.defaultProps = {
    onCrash: undefined,
  };

  return Crash;
};

export default withCrash;
