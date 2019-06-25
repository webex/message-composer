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
  filter: () => Promise.resolve([]),
  renderSuggestion: () => null,
  renderInsert: () => null,
};

export default function() {
  let gDecorations;
  const markMention = (editor) => {
    if (gDecorations) {
      try {
        return editor.setDecorations(gDecorations).value;
      } finally {
        gDecorations = null;
      }
    }
    return null;
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
            case ('Tab'):
            event.preventDefault();
            emitter.emit('SELECT');
            return true;
            case ('Escape'):
            event.preventDefault();
            emitter.emit('DISABLE');
              return true;
            default:
              return false;
          }
        }
        return next();
      },

      onChange(editor, next) {
        const [triggerSymbol, inputValue] = getInput(editor.value)
        
        if (inputValue !== lastInputValue) {
          lastInputValue = inputValue;
          
          if (hasValidAncestors(editor.value)) {
            emitter.emit('SEARCH', inputValue);
          }
          
          const { selection } = editor.value
          
          let decorations = editor.value.decorations.filter(
            value => value.mark.type !== CONTEXT_MARK_TYPE
          );
            
          if (inputValue !== null && hasValidAncestors(editor.value)) {
            const endOfTrigger = selection.start.offset - inputValue.length;
            decorations = decorations.push({
              anchor: {
                key: selection.start.key,
                offset: endOfTrigger - triggerSymbol.length,
              },
              focus: {
                key: selection.start.key,
                offset: endOfTrigger,
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
          return (
            <span {...attributes}>
              {editor.props.mentions.renderInsert(node.data.toJS())}
            </span>
          );
        }
    
        return next();
      },

      commands: {
        clearSuggestionsMarker(editor) {
          gDecorations = editor.value.decorations.filter((value) => value.mark.type !== CONTEXT_MARK_TYPE);
        },
        clearSuggestionsLastInput(editor) {
          lastInputValue = null;
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
