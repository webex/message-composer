import React from 'react';
import {TinyEmitter} from 'tiny-emitter';

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
    const emitter = new TinyEmitter();
    emitter.on('SEARCH', (query) => {
      initialQuery = query;
    });
    const flags = {
      open: false,
    };
    const setFlags = ({open}) => {
      flags.open = open;
    };
    const isOpen = () => flags.open;

    let lastInputValue = null;
    
    return {
      onKeyDown(event, editor, next) {
        if (isOpen()) {
          switch (event.key) {
            case ('ArrowDown'):
            event.preventDefault();
            emitter.emit('MOVE_DOWN');
            return true;
            case ('ArrowUp'):
            event.preventDefault();
            emitter.emit('MOVE_UP');
            return true;
            case ('Enter'):
            event.preventDefault();
            emitter.emit('SELECT');
            return true;
            case ('Escape'):
            event.preventDefault();
            emitter.emit('DISABLE');
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
            emitter.emit('SEARCH', inputValue);
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
              emitter={emitter}
              setFlags={setFlags}
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
