import Prism from 'prismjs'
import 'prismjs/components/prism-markup';
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

export const convertMarkdown = ({editor, node, done}) => {
  let foundListItem = false;
  if (!done) {
    if (node.object != 'text') return;

    const string = node.text;
    const grammar = Prism.languages.markdown;
    const tokens = Prism.tokenize(string, grammar);

    editor.moveToStartOfNode(node);
    for (const token of tokens) {
      if (typeof token === 'string') {
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
            editor.setBlocks(type);
          }
        }
        else {
          for (const i of token.content) {
            if (typeof i === 'string') {
              editor.moveFocusForward(i.length);
              editor.addMark(token.type);
              editor.moveAnchorForward(i.length);
            }
            else {
              editor.moveFocusForward(i.length);
              editor.delete();
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

const MarkDown = () => {
  return {
    decorateNode(node, editor, next) {
      const others = next() || [];
      if (node.object != 'block') {
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
  
      return [...others, ...decorations]
    }
  }
}

export default MarkDown;