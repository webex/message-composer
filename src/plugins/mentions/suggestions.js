import React, {useCallback, useEffect, useRef, useReducer} from 'react';
import {Portal} from 'react-portal';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import usePopper from './usePopper';
import {getInput} from './utils';
import {USER_MENTION_NODE_TYPE} from './types';

const Suggestions = ({setFlags, children, editor, emitter, initialQuery, mentions}) => {
  const mentionsRef = useRef(null);
  const anchorRef = useRef(null);
  const suggestionRef = useRef(null);

  const {styles, placement} = usePopper({
    referrenceRef: anchorRef,
    popperRef: mentionsRef,
    placement: 'top-start',
  });

  const onSelection = (item) => {
    const {value} = editor;
    const [, inputValue] = getInput(value);

    // Delete the captured value, including the `@` symbol
    editor.deleteBackward(inputValue.length + 1);

    const selectedRange = editor.value.selection;

    editor
      .insertText(' ')
      .insertInlineAtRange(selectedRange, {
        data: {
          ...item,
          mentionDisplay: mentions.getDisplay(item),
        },
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: `@${mentions.getDisplay(item)}`,
              },
            ],
          },
        ],
        type: USER_MENTION_NODE_TYPE,
      })
      .focus();
  };

  const indexReducer = (state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return {
          ...state,
          index: state.index !== state.items.length - 1 ? state.index + 1 : 0,
        };
      case 'DECREMENT':
        return {
          ...state,
          index: state.index !== 0 ? state.index - 1 : state.items.length - 1,
        };
      case 'SET_ITEMS':
        return {
          ...state,
          items: action.payload.items,
          disabled: false,
          index: 0,
        };
      case 'DISABLE':
        return {
          ...state,
          disabled: true,
        };
      case 'ENABLE':
        return {
          ...state,
          disabled: false,
        };
      default:
        throw new Error();
    }
  };
  const [state, dispatch] = useReducer(indexReducer, {disabled: false, items: [], index: 0});

  const search = useCallback(
    (q) => {
      mentions.filter(q === null ? '' : q).then((items) => emitter.emit('DISPATCH_SEARCH', items));
    },
    [mentions, emitter]
  );
  const dispatchSearch = (items) => {
    dispatch({type: 'SET_ITEMS', payload: {items}});
  };

  useEffect(() => {
    search(initialQuery);
  }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

  const moveUp = () => {
    dispatch({type: 'DECREMENT'});
  };
  const moveDown = () => {
    dispatch({type: 'INCREMENT'});
  };
  const select = () => {
    suggestionRef.current.click();
  };
  const disable = () => {
    dispatch({type: 'DISABLE'});
  };

  useEffect(() => {
    emitter.on('MOVE_DOWN', moveDown);
    emitter.on('MOVE_UP', moveUp);
    emitter.on('SELECT', select);
    emitter.on('DISABLE', disable);
    emitter.on('SEARCH', search);
    emitter.on('DISPATCH_SEARCH', dispatchSearch);
    editor.props.emitter.on('UPDATE', search);

    return () => {
      emitter.off('MOVE_DOWN', moveDown);
      emitter.off('MOVE_UP', moveUp);
      emitter.off('SELECT', select);
      emitter.off('DISABLE', disable);
      emitter.off('SEARCH', search);
      emitter.off('DISPATCH_SEARCH', dispatchSearch);
      editor.props.emitter.off('UPDATE', search);
    };
  }, [editor, search, emitter]);

  useEffect(() => {
    setFlags({
      open: true,
    });

    return () => {
      setFlags({
        open: false,
      });
    };
  }, [setFlags]);

  useEffect(() => {
    if (suggestionRef.current) {
      suggestionRef.current.scrollIntoView(false);
    }
  });

  let items;

  if (!state.disabled && state.items.length) {
    setFlags({open: true});
    items = state.items.map((item, index) => {
      const active = index === state.index;
      const {key, render} = mentions.renderSuggestion(item, {active});
      const itemProps = {
        onMouseDown: (e) => {
          e.preventDefault();
          onSelection(item);
        },
        onClick: () => {
          // Used by keyboard selection
          onSelection(item);
        },
        className: classnames('suggestion-list-item', {active}),
        'aria-current': active,
        ref: index === state.index ? suggestionRef : null,
        role: 'listitem',
        key,
      };

      return <div {...itemProps}>{render}</div>;
    });
  } else {
    setFlags({open: false});
  }

  const suggestionsStyles = {
    ...styles,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 'thin',
    cursor: 'pointer',
    maxHeight: '15em',
    overflow: 'scroll',
  };

  if (!items) {
    suggestionsStyles.display = 'none';
  }

  return (
    <>
      {children({ref: anchorRef})}
      <Portal>
        <div
          className="suggestion-list"
          role="list"
          ref={mentionsRef}
          style={suggestionsStyles}
          data-placement={placement}
        >
          {items}
        </div>
      </Portal>
    </>
  );
};

Suggestions.propTypes = {
  children: PropTypes.func.isRequired,
  editor: PropTypes.object.isRequired,
  emitter: PropTypes.object.isRequired,
  initialQuery: PropTypes.string,
  mentions: PropTypes.shape({
    filter: PropTypes.func,
    renderSuggestion: PropTypes.func,
    getDisplay: PropTypes.func,
  }).isRequired,
  setFlags: PropTypes.func.isRequired,
};

Suggestions.defaultProps = {
  initialQuery: undefined,
};

export default React.memo(Suggestions);
