import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';

const lineMarkdowns = {
  blockquote: true,
  list: true,
  title: true,
  hr: true,
};
const isLineMarkdown = ({type}) => !!lineMarkdowns[type];

const previewMarkdowns = {
  bold: true,
  code: true,
  italic: true,
};
const canPreview = ({type}) => !!previewMarkdowns[type];

const lists = [];
let currentList;

const setOrderedListStartWith = (token) => {
  const match = /(\d+)\./.exec(token.content);
  return match && match[1];
};
const setCurrentList = ({blockNode, isOrderedList, token}) => {
  currentList = {
    startNode: blockNode,
    endNode: blockNode,
    isOrderedList,
    startsWith: setOrderedListStartWith(token),
  };
};

// Title must have a space between the '#' and the content
const isInvalidTitle = (token) => {
  return token.type === 'title' && Array.isArray(token.content) && token.content[1]
    && token.content[1][0] !== ' ';
}

const lineContentLength = (token) => {
  if (Array.isArray(token.content)) {
    return token.content[0].length;
  }
  else {
    return token.length;
  }
}

const getTitleType = (length) => {
  const type = (length > 5) ? 5 : length;
  return `h${type}`;
}

const urlRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])/igm;
const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/igm;

const codeBegin = /^```[\s]?([\S]*)$/m;
const codeEnd = /^```$/m;

let codeBeginPointer;

const markCode = ({editor, blockNode, done}) => {
  if (done) {
    codeBeginPointer = null;
    return;
  }

  if (blockNode.getTexts().size === 1) {
    const textNode = blockNode.getFirstText();
    if (!codeBeginPointer && codeBegin.test(textNode.text)) {
      const match = codeBegin.exec(textNode.text);
      codeBeginPointer = {
        node: textNode,
        language: match[1],
      };
    }
    else if (codeBeginPointer && codeEnd.test(textNode.text)) {
      codeEnd.exec(textNode.text);
      const codeEndPointer = {
        node: textNode,
      };

      editor.moveAnchorToStartOfNode(codeBeginPointer.node)
        .moveFocusToEndOfNode(codeEndPointer.node)
        .setBlocks('plain')
        .setMark('plain')
        .wrapBlock({type: 'code', data: {language: codeBeginPointer.language}})
        .deleteNode(codeBeginPointer.node)
        .deleteNode(codeEndPointer.node);

      codeBeginPointer = null;
    }
  }
};

// Hide Emails and URLs from markdown parsing
const replaceRegex = (value, regex) => {
  return value.replace(regex, ({length}) => '0'.repeat(length));
};
const hideEmail = (value) => {
  return replaceRegex(value, emailRegex);
};
const hideUrl = (value) => {
  return replaceRegex(value, urlRegex);
};

const initMarkRange = (node) => {
  const resetVars = (node) => {
    const texts = node.getTexts().toArray();
    const startText = texts.shift();
    const endText = startText;
    const startOffset = 0;
    const endOffset = 0;
    const start = 0;
    return {
      texts,
      startText,
      endText,
      startOffset,
      endOffset,
      start,
    };
  }

  let {texts, startText, endText, startOffset, endOffset, start} = resetVars(node);

  return ({editor, length, mark}) => {
    startText = endText
    startOffset = endOffset

    const end = start + length

    let available = startText.text.length - startOffset
    let remaining = length

    endOffset = startOffset + remaining

    while (available < remaining) {
      endText = texts.shift()
      remaining = remaining - available
      available = endText.text.length
      endOffset = remaining
    }

    if (mark !== 'string') {
      editor.moveAnchorToStartOfNode(startText)
        .moveAnchorForward(startOffset)
        .moveFocusToStartOfNode(endText)
        .moveFocusForward(endOffset)
        .addMark(mark);
    }

    start = end;
  };
};

const _convertMarkdown = ({editor, node: blockNode, done}) => {
  let foundListItem = false;  
  if (!done) {
    if (blockNode.object !== 'block' || blockNode.type === 'code') return;

    let input = '';
    for (let node of blockNode.nodes) {
      if (node.type) {
        // Don't want any inlines mistaken for markdown
        input += '0'.repeat(node.text.length);
      }
      else {
        input += node.text;
      }
    }

    const string = hideEmail(hideUrl(input));
    const grammar = Prism.languages.markdown;
    const tokens = Prism.tokenize(string, grammar);

    const markRange = initMarkRange(blockNode);
    for (const token of tokens) {
      if (typeof token === 'string' || isInvalidTitle(token)) {
        markRange({editor, length: token.length, mark: 'string'});
      }
      else {
        if (isLineMarkdown(token)) {
          const length = lineContentLength(token);
          markRange({editor, length, mark: 'delete'})
          
          if (token.type === 'list') {
            // Unordered list will be one character (-, #, etc)
            // Ordered list will be digit plus a period
            const isOrderedList = length > 1;
            foundListItem = true;
            editor.setBlocks('list-item');
            if (!currentList) {
              // Start a list
              setCurrentList({blockNode, isOrderedList, token});
            }
            else if (currentList.isOrderedList !== isOrderedList) {
              // New type of list. End the old one
              lists.push(currentList);
              setCurrentList({blockNode, isOrderedList, token});
            }
            else {
              // Add to existing list
              currentList.endNode = blockNode;
            }
          }
          else {
            const type = (token.type === 'title') ? getTitleType(length) : token.type;
            editor.setBlocks({type});
          }
        }
        else if (token.type === 'code') {
          // Non-backtick 'code' block
          if (token.content.length > 0 && token.content.charAt(0) !== '`') {
            markRange({editor, length: token.length, mark: token.type});
          }
          else {
            // Remove the first and last characters which are backticks
            const length = token.content.length - 2;
            markRange({editor, length: 1, mark: 'delete'});
            markRange({editor, length, mark: token.type});
            markRange({editor, length: 1, mark: 'delete'});
          }
        }
        else if (token.type !== 'tag') {
          for (const i of token.content) {
            if (typeof i === 'string') {
              markRange({editor, length: i.length, mark: token.type});
            }
            else if (token.type === 'punctuation') {
              markRange({editor, length: i.length, mark: 'delete'});
            }
            else {
              markRange({editor, length: i.length, mark: i.type});
            }
          }
        }
      }
    }
  }

  if (currentList && !foundListItem) {
    lists.push(currentList);
    currentList = null;
  }

  if (done) {
    for (const list of lists) {
      // Wrap it in a list element
      const {startNode, endNode, isOrderedList, startsWith} = list;
      const blockType = isOrderedList ? 'ordered-list' : 'unordered-list';
      editor.moveAnchorToStartOfNode(startNode)
        .moveFocusToEndOfNode(endNode)
        .wrapBlock({type: blockType, data: {start: startsWith}});

      currentList = null;
    }
    lists.length = 0;
  }
};

export const convertMarkdown = ({editor}) => {
  if (editor.props.markdown.disabled) return;

  // Find all of the code blocks to avoid converting
  // code block inner texts to markdown
  for (const blockNode of editor.value.document.nodes) {
    markCode({editor, blockNode});
  }
  markCode({editor, done: true});
  
  for (const node of editor.value.document.nodes) {
    _convertMarkdown({editor, node});
  }
  _convertMarkdown({editor, done: true});
};

const MarkDown = () => {
  return {
    decorateNode(node, editor, next) {
      const others = next() || [];
      if (node.object !== 'block' || editor.props.markdown.disabled) {
        return others;
      }
  
      const decorations = [];

      const string = hideUrl(hideEmail(node.text));
      const grammar = Prism.languages.markdown;
      const tokens = Prism.tokenize(string, grammar);

      const resetVars = (node) => {
        const texts = node.getTexts().toArray();
        const startText = texts.shift();
        const endText = startText;
        const startOffset = 0;
        const endOffset = 0;
        const start = 0;
        return {
          texts,
          startText,
          endText,
          startOffset,
          endOffset,
          start,
        };
      }

      let {texts, startText, endText, startOffset, endOffset, start} = resetVars(node);
  
      function getLength(token) {
        if (typeof token == 'string') {
          return token.length
        } else if (typeof token.content == 'string') {
          return token.content.length
        } else {
          return token.content.reduce((l, t) => l + getLength(t), 0)
        }
      }
  
      for (const token of tokens) {
        startText = endText
        startOffset = endOffset
  
        const length = (canPreview(token))
          ? getLength(token)
          : token.length;
        const end = start + length
  
        let available = startText.text.length - startOffset
        let remaining = length
  
        endOffset = startOffset + remaining
  
        while (available < remaining) {
          endText = texts.shift()
          remaining = remaining - available
          available = endText.text.length
          endOffset = remaining
        }
  
        if (typeof token !== 'string' && canPreview(token)) {
          const dec = {
            anchor: {
              key: startText.key,
              offset: startOffset,
            },
            focus: {
              key: endText.key,
              offset: endOffset,
            },
            mark: {
              type: token.type,
            },
          }
  
          decorations.push(dec)
        }
  
        start = end;
      }
  
      return [...others, ...decorations];
    },
    commands: {
      setMark(editor, mark) {
        editor.value.document.getMarksAtRange(editor.value.selection).forEach((mark) => {
          editor.removeMark(mark.type);
        });
        editor.toggleMark(mark);
      },
      deleteNode(editor, node) {
        editor.moveAnchorToStartOfNode(node);
        editor.moveFocusToEndOfNode(node);
        editor.delete();
      },
    },
  };
};

export default MarkDown;