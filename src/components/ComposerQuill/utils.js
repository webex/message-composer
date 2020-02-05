export function getFirstName(name) {
  const index = name.indexOf(' ');

  return index > 0 ? name.substring(0, index) : name;
}

// converts a string of text into operation deltas
export function buildContents(text) {
  const split = text.split(/(<spark-mention [a-zA-Z0-9-='"\s]+>.+?<\/spark-mention>)/);

  const contents = split.map((line) => {
    // convert spark-mention into a mention delta
    if (line.indexOf('<spark-mention ') === 0) {
      // converts the string to a html element so we can grab the data
      const object = new DOMParser().parseFromString(line, 'text/xml');
      // DOMParser returns a document but we just need the first element
      const mention = object.firstChild;
      const objectType = mention.getAttribute('data-object-type');
      let objectId;

      if (objectType === 'person') {
        objectId = mention.getAttribute('data-object-id');
      }

      return {
        insert: {
          mention: {
            index: 0,
            denotationChar: '@',
            id: objectId,
            objectType,
            value: mention.textContent,
          },
        },
      };
    }

    // otherwise just insert the text
    return {insert: line};
  });

  return contents;
}

// gets the text inside the composer
export function getQuillText(quill) {
  const contents = quill.getContents();
  let sb = '';

  contents.forEach((op) => {
    if (typeof op.insert === 'string') {
      // if its just a string then we can insert right away
      sb += op.insert;
    } else if (typeof op.insert === 'object') {
      if (op.insert.mention) {
        // if it's a mention object, convert it to a string with spark-mention tag
        const {mention} = op.insert;

        if (mention.objectType === 'groupMention') {
          sb += "<spark-mention data-object-type='groupMention' data-group-type='all'>";
          sb += mention.value;
          sb += '</spark-mention>';
        } else {
          sb += `<spark-mention data-object-type='person' data-object-id='${mention.id}'>`;
          sb += mention.value;
          sb += '</spark-mention>';
        }
      }
    }
  });

  return sb;
}

// builds up the avatar for a mention item
export function buildMentionAvatar(item) {
  const {id, src, displayName} = item;
  let classes = 'ql-mention-avatar';
  let avatar;

  if (src) {
    // if we have a picture then use that
    avatar = `<img class='${classes}' src='${src}'>`;
  } else {
    // otherwise we build it ourself
    let initials;

    if (id === 'all') {
      // avatar is a circle @ for all
      classes += ' all';
      initials = '@';
    } else {
      // use the initials of the name as the avatar
      let chars = displayName.charAt(0);
      const space = displayName.indexOf(' ');

      if (space >= 0) {
        chars += displayName.charAt(space + 1);
      }

      initials = chars.toUpperCase();
    }

    avatar = `<div class='${classes}'>${initials}</div>`;
  }

  return avatar;
}

// build the text element for mention item
export function buildMentionText(item) {
  const {id, displayName} = item;
  let secondary;
  let text = '';

  if (id === 'all') {
    secondary = 'Mention everyone in this space';
  }

  text += "<div class='ql-mention-item-text'>";
  text += "<div class='ql-mention-item-text-primary'>";
  text += displayName;
  text += '</div>';
  if (secondary) {
    text += "<div class='ql-mention-item-text-secondary'>";
    text += secondary;
    text += '</div>';
  }
  text += '</div>';

  return text;
}
