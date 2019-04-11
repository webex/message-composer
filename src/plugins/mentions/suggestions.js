import React, {useState, useEffect, useRef, useReducer} from 'react';
import {Portal} from 'react-portal';

import usePopper from './usePopper';
import {getInput} from './utils';
import {USER_MENTION_NODE_TYPE} from './types';

export default React.memo((props) => {
  const mentionsRef = useRef(null);
  const anchorRef = useRef(null);
  const suggestionRef = useRef(null);
  
  const {styles, placement} = usePopper({
    referrenceRef: anchorRef,
    popperRef: mentionsRef,
    placement: 'top-start',
  });
  
  const onSelection = (item) => {
    const editor = props.editor;
    const value = editor.value;
    const [triggerSymbol, inputValue] = getInput(value);
    
    // Delete the captured value, including the `@` symbol
    editor.deleteBackward(inputValue.length + 1)
    
    const selectedRange = editor.value.selection;
    
    editor
    .insertText(' ')
    .insertInlineAtRange(selectedRange, {
      data: item,
      nodes: [
        {
          object: 'text',
          leaves: [
            {
              text: `@${item.displayName}`,
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
        index: (state.index !== (state.items.length - 1)) ? state.index + 1 : 0,
      };
      case 'DECREMENT':
      return {
        ...state,
        index: (state.index !== 0) ? state.index - 1 : state.items.length - 1,
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
      }
      default:
      throw new Error();
    }
  };
  const [state, dispatch] = useReducer(indexReducer, {disabled: false, items: [], index: 0});
  
  const search = (q) => {
    dispatch({
      type: 'SET_ITEMS',
      payload: {
        items: props.mentions.filter(q),
      },
    });
  }
  useEffect(() => {
    search(props.initialQuery)
  }, []);
  
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
  }

  useEffect(() => {
    props.emitter.on('MOVE_DOWN', moveDown);
    props.emitter.on('MOVE_UP', moveUp);
    props.emitter.on('SELECT', select);
    props.emitter.on('DISABLE', disable);
    props.emitter.on('SEARCH', search);

    return () => {
      props.emitter.off('MOVE_DOWN', moveDown);
      props.emitter.off('MOVE_UP', moveUp);
      props.emitter.off('SELECT', select);
      props.emitter.off('DISABLE', disable);
      props.emitter.off('SEARCH', search);
    }
  }, [props.emitter]);
  
  useEffect(() => {
    props.setFlags({
      open: true,
    });
    
    return () => {
      props.setFlags({
        open: false,
      });
    }
  }, [props.setFlags]);

  useEffect(() => {
    if (suggestionRef.current) {
      suggestionRef.current.scrollIntoView(false);
    }
  });
  
  const anchor = props.children({ref: anchorRef});
  const suggestionsStyles = {
    ...styles,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 'thin',
    cursor: 'pointer',
    maxHeight: '15em',
    overflow: 'scroll',
  };
  let portal;
  if (!state.disabled && state.items.length) {
    const items = state.items.map((item, index) => {
      const active = index === state.index;
      const {key, render} = props.mentions.renderSuggestion(item, {active});
      const itemProps = {
        onMouseDown: (e) => {
          e.preventDefault();
          onSelection(item);
        },
        onClick: () => {
          // Used by keyboard selection
          onSelection(item);
        },
        className: active ? 'active' : '',
        'aria-current': active,
        ref: index === state.index ? suggestionRef : null,
        role: 'listitem',
        key,
      };
      return (
        <div {...itemProps}>
          {render}
        </div>
      ) 
    });
    portal = (
      <Portal>
        <div role="list" ref={mentionsRef} style={suggestionsStyles} data-placement={placement}>
          {items}
        </div>
      </Portal>
    );
  }
  return (
    <>
      {anchor}
      {portal}
    </>
  );
});