// not a full sanitization plugin
// only converts < and > carots to their html entities
function sanitizerPlugin(md) {
  // changes any carots (<, >) the user types to html entities
  function sanitizeInline(state) {
    // state.tokens are the contents of the editor as an array of html objects
    state.tokens.forEach((token) => {
      const {type} = token;

      // inline object are the text of the elements
      if (type === 'inline') {
        const {children} = token;

        // these are the child html elements inside the inline element
        children.forEach((child, childIndex) => {
          const childContent = child.content.length > 0 ? child.content : child.markup;
          const childType = child.type;

          // if there is a html element in here, then we want to change the tags to html entities
          if (childType === 'html_inline') {
            const replaced = childContent.replace(/</g, '&lt;').replace(/(?!^)>/gm, '&gt;');

            children[childIndex].content = replaced;
          }
        });
      }
    });
  }

  md.core.ruler.after('linkify', 'sanitize_inline', sanitizeInline);
}

export default sanitizerPlugin;
