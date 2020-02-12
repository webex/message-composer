const mentionPersonRegex = /<spark-mention data-object-type='person' data-object-id='[\w-]+'>/;
const mentionGroupRegex = /<spark-mention data-object-type='groupMention' data-group-type='all'>/;
const mentionCloseRegex = /<\/spark-mention>/;

function sanitizerPlugin(md) {
  // changes any carrots (<, >) the user types to html entities
  function sanitizeInline(state) {
    console.log('plugin state', state);

    // state.tokens are the contents of the editor as an array of html objects
    state.tokens.forEach((token) => {
      const {type} = token;

      // inline object are the text of the elements
      if (type === 'inline') {
        const {children} = token;

        // these are the child html elements inside the inline element
        children.forEach((child, childIndex) => {
          const childContent = child.content;
          const childType = child.type;

          // if there is a html element in here, then we want to change the tags to html entities
          if (childType === 'html_inline') {
            // only allow <spark-mention> tags to pass
            if (
              !mentionPersonRegex.test(childContent) &&
              !mentionGroupRegex.test(childContent) &&
              !mentionCloseRegex.test(childContent)
            ) {
              const replaced = childContent.replace(/</g, '&lt;').replace(/(?!^)>/gm, '&gt;');

              children[childIndex].content = replaced;
            }
          }
        });
      }
    });
  }

  md.core.ruler.after('linkify', 'sanitize_inline', sanitizeInline);
}

export default sanitizerPlugin;
