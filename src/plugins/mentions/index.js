import React from 'react';

import {CONTEXT_MARK_TYPE, USER_MENTION_NODE_TYPE} from './types';
import {hasValidAncestors, getInput} from './utils';
import Suggestions from './suggestions';

const renderMentionContext = (props) => ({ref}) => (
  <span {...props.attributes} ref={ref} className="mention-context">
    {props.children}
  </span>
);

const schema = {
  inlines: {
    [USER_MENTION_NODE_TYPE]: {
      // It's important that we mark the mentions as void nodes so that users
      // can't edit the text of the mention.
      isVoid: true,
    },
  },
};

const defaultMentionProps = {
  filter: () => [],
  renderUser: () => null,
};

export default function() {
  let gDecorations;
  const markMention = (editor) => {
    if (gDecorations) {
      editor.setDecorations(gDecorations);
      gDecorations = null;
    }
  }

  const Plugin = () => {
    let initialQuery
    const command = {};
    const resetCommand = () => {
      command.disable = () => {};
      command.moveUp = () => {};
      command.moveDown = () => {};
      command.select = () => {};
      command.search = (query) => { initialQuery = query; };
      command.open = false;
    }
    resetCommand();
    const setCommand = (c = {}) => {
      if (!c.open) {
        resetCommand();
      }
      else {
        for (const k in c) {
          command[k] = c[k];
        }
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
        editor.clearSuggestionsMarker();
        next();
      },

      onFocus(event, editor, next) {
        editor.clearSuggestionsLastInput();
        next();
      },

      renderMark(props, editor, next) {
        if (props.mark.type === CONTEXT_MARK_TYPE) {
          return (
            <Suggestions
              setCommand={setCommand}
              initialQuery={initialQuery}
              mentions={editor.props.mentions || defaultMentionProps}
              editor={editor}
            >
              {renderMentionContext(props)}
            </Suggestions>
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

      commands: {
        clearSuggestionsMarker(editor) {
          gDecorations = editor.value.decorations.filter((value) => value.mark.type !== CONTEXT_MARK_TYPE);
        },
        clearSuggestionsLastInput(editor) {
          lastInputValue = '';
        },
      },

      schema,
    };
  };

  return {
    markMention,
    Plugin,
  };
};
