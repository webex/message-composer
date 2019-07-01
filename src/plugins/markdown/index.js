import Prism from 'prismjs'
import 'prismjs/components/prism-markdown';

const lineMarkdowns = {
  blockquote: true,
  list: true,
  title: true,
};
const isLineMarkdown = ({type}) => !!lineMarkdowns[type];

const previewMarkdowns = {
  bold: true,
  code: true,
  italic: true,
};
const canPreview = ({type}) => !!previewMarkdowns[type];

let listStartNode;
let listEndNode;

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

const urlRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
const markdownUrlRegex = /\[[^\]]+\]\((?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])\)/igm;

const emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/igm;

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

const isClearMark = ({editor, length}) => {
  const isCharClear = (editor) => {
    editor.moveFocusForward(1);
    const isClear = editor.value.marks.some(mark => mark.type === 'clear');
    editor.moveFocusBackward(1);
    return isClear;  
  };
  
  const count = length || 1;
  // Check the first character
  if (isCharClear(editor)) return true;

  const endCharLocation = length - 1;
  editor.moveForward(endCharLocation);
  // Check the last character
  const isClear = isCharClear(editor);
  editor.moveBackward(endCharLocation);
  return isClear;
};

const _convertMarkdown = ({editor, node: blockNode, done}) => {
  let foundListItem = false;  
  if (!done) {
    if (blockNode.object !== 'block' || blockNode.type === 'code') return;

    for (let node of blockNode.getTexts()) {
      const string = node.text;
      const grammar = Prism.languages.markdown;
      const tokens = Prism.tokenize(string, grammar);

      editor.moveToStartOfNode(node);
      for (const token of tokens) {
        if (typeof token === 'string' || isInvalidTitle(token)) {
          editor.moveForward(token.length);
        }
        else {
          if (isLineMarkdown(token)) {
            const length = lineContentLength(token);
            editor.moveFocusForward(length);
            editor.delete();

            if (token.type === 'list') {
              foundListItem = true;
              editor.setBlocks('list-item');
              if (!listStartNode) {
                listStartNode = node;
              }
              listEndNode = node;
            }
            else {
              const type = (token.type === 'title') ? getTitleType(length) : token.type;
              editor.setBlocks({type, data: {test: 'Can I find this'}});
            }
          }
          else if (token.type === 'code') {
            // Non-backtick 'code' block
            if (token.content.length > 0 && token.content.charAt(0) !== '`') {
              editor.moveFocusForward(token.length)
                .addMark(token.type)
                .moveAnchorForward(token.length);
            }
            else {
              // Remove the first and last characters which are backticks
              const length = token.content.length - 2;
              editor.moveFocusForward(1)
                .delete()
                .moveFocusForward(length)
                .addMark(token.type)
                .moveAnchorForward(length)
                .moveFocusForward(1)
                .delete();
            }
          }
          else if (token.type !== 'tag') {
            const isClear = isClearMark({editor, length: token.length}); // If clear, skip these markdown tokens
            for (const i of token.content) {
              if (typeof i === 'string') {
                editor.moveFocusForward(i.length);
                if (!isClear) {
                  editor.addMark(token.type);
                }
                editor.moveAnchorForward(i.length);
              }
              else {
                editor.moveFocusForward(i.length);
                if (isClear) {
                  editor.moveAnchorForward(i.length);
                }
                else {
                  editor.delete();
                }
              }
            }
          }
        }
      }
    }
  }

  if (listStartNode && !foundListItem) {
    // This is the end of the list. Wrap it in a list element
    editor.moveAnchorToStartOfNode(listStartNode);
    editor.moveFocusToEndOfNode(listEndNode);
    editor.wrapBlock('list');
    listStartNode = null;
    listEndNode = null;
  }
};

const setRegexMarks = ({editor, regex, type}) => {
  regex.lastIndex = 0;
  let test = regex.exec(editor.value.document.text);
  while (test) {
    editor
      .moveTo(test.index)
      .moveFocusForward(test[0].length)
      .setMark(type);

    test = regex.exec(editor.value.document.text);
  }
};

const setAnyMarks = ({editor, regex}) => {
  return setRegexMarks({editor, regex, type: 'clear'});
};

const setUrlMarks = ({editor}) => {
  return setAnyMarks({editor, regex: urlRegex});
};

const setEmailMarks = ({editor}) => {
  return setAnyMarks({editor, regex: emailRegex});
};

const setMarkdownUrlMarks = ({editor}) => {
  return setRegexMarks({editor, regex: markdownUrlRegex, type: 'url'});
};

export const convertMarkdown = ({editor}) => {
  if (editor.props.markdown.disabled) return;

  // Find all of the code blocks to avoid converting
  // code block inner texts to markdown
  for (const blockNode of editor.value.document.nodes) {
    markCode({editor, blockNode});
  }
  markCode({editor, done: true});
  
  setUrlMarks({editor});
  setEmailMarks({editor});
  for (const node of editor.value.document.nodes) {
    _convertMarkdown({editor, node});
  }
  _convertMarkdown({editor, done: true});
  
  setMarkdownUrlMarks({editor});
};

const MarkDown = () => {
  return {
    decorateNode(node, editor, next) {
      const others = next() || [];
      if (node.object !== 'block' || editor.props.markdown.disabled) {
        return others;
      }
  
      const decorations = [];

      const string = node.text
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