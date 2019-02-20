import {createElement} from 'react';

const RenderPlugin = ({marks, nodes}) => {
  return {
    renderMark(props, editor, next) {
      const {mark, children, attributes} = props;
      for (const type of Object.entries(marks)) {
        if (mark.type === type[0]) {
          return createElement(type[1], props, children);
        }
      }
      return next();
    },
    renderNode(props, editor, next) {
      const {node, children, attributes} = props;
      for (const type of Object.entries(nodes)) {
        if (node.type === type[0]) {
          return createElement(type[1], props, children);
        }
      }
      return next();
    },
  };
};

export default RenderPlugin;