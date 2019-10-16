import Html from 'slate-html-serializer';
import Text from 'slate-plain-serializer';
import React, { cloneElement } from 'react';
import commonmark from 'commonmark';
import ReactHtmlParser from 'react-html-parser';
import { convertMarkdown } from '../../plugins/markdown';
const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code'
}; // Add a dictionary of mark tags.

const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline'
};
let mentions = [];
let groupMentions = [];

const addNewLine = children => {
  if (children.length) {
    const last = children[children.length - 1];

    if (last) {
      children[children.length - 1] = `${last}\n`;
    }
  }

  return children;
};

const convertMarkdownToHTML = md => {
  const reader = new commonmark.Parser();
  const writer = new commonmark.HtmlRenderer();
  const parsed = reader.parse(md);
  let value = writer.render(parsed);
  value = value.replace(/^<p>([\s\S]*)<\/p>\s$/, '$1');
  return React.createElement(React.Fragment, null, ReactHtmlParser(value));
};

const cleanUpContent = content => {
  let newContent = content; // Remove the last unwanted \n in a code block

  newContent = newContent.replace(/\n<\/code>/, '</code>'); // There should always be a language class

  newContent = newContent.replace(/<code>/g, '<code class="language-none">'); // Make empty divs into breaks

  newContent = newContent.replace(/<div><\/div>/g, '<br>');
  return newContent;
};
/* eslint-disable jsx-a11y/heading-has-content */


const blocks = {
  blockquote: React.createElement("blockquote", null),
  'unordered-list': React.createElement("ul", null),
  'ordered-list': React.createElement("ol", null),
  'list-item': React.createElement("li", null),
  h1: React.createElement("h1", null),
  h2: React.createElement("h2", null),
  h3: React.createElement("h3", null),
  h4: React.createElement("h4", null),
  h5: React.createElement("h5", null),
  hr: React.createElement("hr", null)
};
/* eslint-enable jsx-a11y/heading-has-content */

const rules = [{
  deserialize(el, next) {
    const type = BLOCK_TAGS[el.tagName.toLowerCase()];

    if (type) {
      return {
        object: 'block',
        type: type,
        data: {
          className: el.getAttribute('class')
        },
        nodes: next(el.childNodes)
      };
    }
  },

  serialize(obj, children) {
    if (obj.object === 'block') {
      switch (obj.type) {
        case 'paragraph':
          return React.createElement("div", {
            className: obj.data.get('className')
          }, children);

        case 'code':
          {
            const lang = obj.data.get('language') || 'none';
            return React.createElement("pre", null, React.createElement("code", {
              className: `language-${lang}`
            }, children));
          }

        case 'plain':
          return React.createElement(React.Fragment, null, children);

        case 'blockquote':
        case 'list-item':
        case 'unordered-list':
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
          return cloneElement(blocks[obj.type], {}, children);

        case 'ordered-list':
          return cloneElement(blocks[obj.type], {
            start: obj.data.get('start')
          }, children);

        case 'hr':
          return cloneElement(blocks[obj.type]);

        default:
          return null;
      }
    } else if (obj.object === 'inline') {
      if (obj.type === 'userMention') {
        const id = obj.data.get('id');
        const objectType = obj.data.get('objectType');

        if (objectType === 'groupMention') {
          groupMentions.push({
            groupType: id,
            objectType
          });
          return React.createElement("spark-mention", {
            "data-object-type": objectType,
            "data-group-type": id
          }, obj.data.get('mentionDisplay'));
        } else {
          mentions.push({
            id,
            objectType
          });
          return React.createElement("spark-mention", {
            "data-object-type": objectType,
            "data-object-id": id
          }, obj.data.get('mentionDisplay'));
        }
      }
    }
  }

}, // Add a new rule that handles marks...
{
  deserialize(el, next) {
    const type = MARK_TAGS[el.tagName.toLowerCase()];

    if (type) {
      return {
        object: 'mark',
        type: type,
        nodes: next(el.childNodes)
      };
    }
  },

  serialize(obj, children) {
    if (obj.object === 'mark') {
      switch (obj.type) {
        case 'bold':
          return React.createElement("strong", null, children);

        case 'italic':
          return React.createElement("em", null, children);

        case 'underline':
          return React.createElement("u", null, children);

        case 'code':
          return React.createElement("code", {
            className: "language-none"
          }, children);

        case 'url':
          return convertMarkdownToHTML(children[0]);

        case 'plain':
          return React.createElement(React.Fragment, null, addNewLine(children));

        case 'clear':
          return React.createElement(React.Fragment, null, children);

        case 'delete':
          return React.createElement(React.Fragment, null);

        default:
          return null;
      }
    }
  }

}];
const html = new Html({
  rules
});

const serializePlugin = value => {
  const notifyKeyDown = (editor, event) => {
    if (editor.props.notifyKeyDown) {
      editor.props.notifyKeyDown(event);
    }
  };

  return {
    onKeyDown(event, editor, next) {
      if (event.shiftKey) {
        notifyKeyDown(editor, event);
        return next();
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        editor.sendMessage();
        return true;
      }

      notifyKeyDown(editor, event);
      return next();
    },

    commands: {
      sendMessage(editor) {
        const displayName = Text.serialize(editor.value);
        convertMarkdown({
          editor
        });
        const content = cleanUpContent(html.serialize(editor.value));
        const message = {
          displayName,
          content
        };

        if (mentions.length) {
          message.mentions = mentions;
          mentions = [];
        }

        if (groupMentions.length) {
          message.groupMentions = groupMentions;
          groupMentions = [];
        }

        editor.props.onChange({
          value
        });
        setTimeout(() => {
          editor.props.send(message);
          editor.focus();
        });
      }

    }
  };
};

export default serializePlugin;