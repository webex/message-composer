import React, {useState, useEffect, useRef, useReducer} from 'react';
import ReactDOM from 'react-dom';
import {Portal} from 'react-portal';

import usePopper from './usePopper';

/**
 * The decoration mark type that the menu will position itself against. The
 * "context" is just the current text after the @ symbol.
 * @type {String}
 */
const CONTEXT_MARK_TYPE = 'mentionContext';

const USER_MENTION_NODE_TYPE = 'userMention';

/**
 * Determine if the current selection has valid ancestors for a context. In our
 * case, we want to make sure that the mention is only a direct child of a
 * paragraph.
 * 
 * @param {Value} value
 */

function hasValidAncestors(value) {
  const { document, selection } = value

  const invalidParent = document.getClosest(
    selection.start.key,
    // In this simple case, we only want mentions to live inside a paragraph.
    // This check can be adjusted for more complex rich text implementations.
    node => node.type !== 'paragraph'
  )

  return !invalidParent
}

/**
 * The regex to use to find the searchQuery.
 *
 * @type {RegExp}
 */

const CAPTURE_REGEX = /@([^@\s]*[ ]?[^@\s]*)$/;

/**
 * Get get the potential mention input.
 *
 * @type {Value}
 */

const getInput = (value) => {
  // In some cases, like if the node that was selected gets deleted,
  // `startText` can be null.
  if (!value.startText) {
    return null;
  }

  const startOffset = value.selection.start.offset;
  const textBefore = value.startText.text.slice(0, startOffset);
  const result = CAPTURE_REGEX.exec(textBefore);

  return result && result[1];
};

const Mentions = React.memo((props) => {
  const mentionsRef = useRef(null);
  const anchorRef = useRef(null);
  const suggestionRef = useRef(null);
  
  const {styles, placement} = usePopper({
    referrenceRef: anchorRef,
    popperRef: mentionsRef,
    placement: 'bottom-start',
  });
  
  const onSelection = (item) => {
    const editor = props.editor;
    const value = editor.value;
    const inputValue = getInput(value);
    
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
        index: (state.index !== (state.items.length - 1)) ? state.index + 1 : 0
      };
      case 'DECREMENT':
      return {
        ...state,
        index: (state.index !== 0) ? state.index - 1 : state.items.length - 1
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
    if (props.setCommand) {
      props.setCommand({
        disable,
        search,
        moveUp,
        moveDown,
        select,
        open: true,
      });
    }
    
    return () => {
      props.setCommand({
        open: false,
      });
    }
  }, [props.setCommand]);
  
  const anchor = props.children({ref: anchorRef});
  const suggestionsStyles = {
    ...styles,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 'thin',
  };
  let portal;
  if (!state.disabled && state.items.length) {
    portal = (
      <Portal>
        <div ref={mentionsRef} style={suggestionsStyles} data-placement={placement}>
          {
            state.items.map((item, index) => {
              const itemProps = {
                onClick: () => onSelection(item),
                className: index === state.index ? 'active' : '',
                ref: index === state.index ? suggestionRef : null,
              }
              return props.mentions.renderUser({item, props: itemProps})
            })
          }
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


const renderMentionContext = (props) => ({ref}) => (
  <span {...props.attributes} ref={ref} className="mention-context">
    {props.children}
  </span>
);

export const schema = {
  inlines: {
    [USER_MENTION_NODE_TYPE]: {
      // It's important that we mark the mentions as void nodes so that users
      // can't edit the text of the mention.
      isVoid: true,
    },
  },
};

let gDecorations;
export const markMention = (editor) => {
  if (gDecorations) {
    editor.setDecorations(gDecorations);
    gDecorations = null;
  }
}

export const Plugin = () => {
  let initialQuery
  const setInitialQuery = (query) => { initialQuery = query; };
  const command = {
    search: setInitialQuery,
    open: false,
  };
  const setCommand = (c = {}) => {
    for (const k in c) {
      command[k] = c[k];
    }
    if (!c.search) {
      command.search = setInitialQuery;
    }
  };

  let lastInputValue = null;
  
  return {
    onKeyDown(event, editor, next) {
      if (command.open) {
        switch (event.key) {
          case ('ArrowDown'):
          event.preventDefault();
          command.moveDown();
          return true;
          case ('ArrowUp'):
          event.preventDefault();
          command.moveUp();
          return true;
          case ('Enter'):
          event.preventDefault();
          command.select();
          return true;
          case ('Escape'):
          event.preventDefault();
          command.disable();
            return true;
        }
      }
      return next();
    },

    onChange(editor, next) {
      const inputValue = getInput(editor.value)
      
      if (inputValue !== lastInputValue) {
        lastInputValue = inputValue;
        
        if (hasValidAncestors(editor.value)) {
          command.search(inputValue);
        }
        
        const { selection } = editor.value
        
        let decorations = editor.value.decorations.filter(
          value => value.mark.type !== CONTEXT_MARK_TYPE
          )
          
          if (inputValue && hasValidAncestors(editor.value)) {
            decorations = decorations.push({
              anchor: {
                key: selection.start.key,
                offset: selection.start.offset - inputValue.length,
              },
            focus: {
              key: selection.start.key,
              offset: selection.start.offset,
            },
            mark: {
              type: CONTEXT_MARK_TYPE,
            },
          })
        }

        gDecorations = decorations;
      }
      next();
    },

    onBlur(event, editor, next) {
      // Remove 'mentions' when losing focus
      gDecorations = editor.value.decorations.filter((value) => value.mark.type !== CONTEXT_MARK_TYPE);
      next();
    },

    onFocus(event, editor, next) {
      lastInputValue = '';
      next();
    },

    renderMark(props, editor, next) {
      if (props.mark.type === CONTEXT_MARK_TYPE) {
        return (
          <Mentions
            setCommand={setCommand}
            initialQuery={initialQuery}
            mentions={editor.props.mentions}
            editor={editor}
          >
            {renderMentionContext(props)}
          </Mentions>
        );
      }
  
      return next();
    },

    renderNode(props, editor, next) {
      const { attributes, node } = props
  
      if (node.type === USER_MENTION_NODE_TYPE) {
        return <b {...attributes}>{props.node.text}</b>;
      }
  
      return next();
    },
  };
};
