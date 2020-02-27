# API

Definitition of the props for the message composer. Props related to the Quill composer are listed. A few props related to Slate may not be listed.

## Props

### Table of Contents

- [composerType](#composerType)
- [draft](#draft)
- [mentions](#mentions)
- [notifyKeyDown](#notifyKeyDown)
- [onError](#onError)
- [placeholder](#placeholder)
- [send](#send)
- [setEmitter](#setEmitter)
- [Toolbar](#Toolbar)

### composerType

`composerType: PropTypes.oneOf(['slate', 'quill'])`
<br>
`default: 'slate'`

Choose the text editor to use. Options are [slate](https://github.com/ianstormtaylor/slate) or [quill](https://github.com/quilljs/quill).

### draft

`draft: PropTypes.shape({ id: PropTypes.any, value: PropTypes.object, save: PropTypes.func, })`

Drafts are used to save the contents of the composer without sending. For example, switching between different conversations.

The object should look like this:

```javascript
{
  id: string,
  value: string,
  save: (value, id) => {},
}
```

`id` is a string that is used to differentiate between different drafts.

`value` is the text that will be inserted to the composer on mount/update.

`save` is the function that will be called when the editor's text changes. The parameters are the editor's current text and the draft's id.

### mentions

`mentions: PropTypes.shape({ participants: PropTypes.shape({ current: PropTypes.array, }), }),`

Object containing an array of participants of mention-able people. The list should be inside a ref so it can update without re-render.

Participant object should look like:

```javascript
{
  id: string, // id of the participant
  type: string, // something like 'person'
  src: string, // OPTIONAL - image source for avatar
  displayName: string, // their name
}
```

Example:

```javascript
const participantsRef = useRef();
const participants = [
  {
    id: '1',
    type: 'person',
    displayName: 'Michael',
  },
  {
    id: '2',
    type: 'person',
    displayName: 'Dwight',
  },
];

participantsRef.current = participants;

const mentions = {participants: participantsRef};

return <Composer mentions={mentions} />;
```

### notifyKeyDown

`notifyKeyDown: PropTypes.func`

Function that is called when the text inside the composer changes.

### onError

`onError: PropTypes.func`

Function that is called when catching an error.

The function will be passed the name of the composer, the name of the function, and the error itself.

Example:

```javascript
const onError = (composer, method, error) => {
  const id = uuid.v4();
  const jsonStack = JSON.stringify(error.stack).replace(/\\n/g, '\n');
  const name = `${composer}->${method}`;

  Logger.submit({
    error,
    composer,
    method: name,
    log: `${id}:${jsonStack}`,
  });
};
```

### placeholder

`placeholder: PropTypes.string`

Placeholder string for the composer.

### send

`send: PropTypes.func`

Function that executes on pressing enter.

#### Parameter

The function should take in an object that will represent the contents inside the composer. The object will be different depending on what was inside the composer during send.

##### Text without markdowns or mentions.

```javascript
{
  displayName: text,
}
```

##### Text with markdowns

```javascript
{
  displayName: strippedText, // text without the markdown characters
  content: parsedText, // text with html tags
}
```

##### Text with mentions

<sup>(would be the same if it had markdowns too)</sup>

```javascript
{
  displayName: text,
  content: parsedText,
  mentions: [
    {
      id: userId
    },
  ],
}
```

#### Return

If the function returns true, the composer will clear out its contents.

### setEmitter

`setEmitter: PropTypes.func`

Function that passes the message composer's emitter back to the parent.

### Toolbar

`Toolbar: PropTypes.func`

Toolbar component to render above the composer.
