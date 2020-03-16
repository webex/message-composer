# Development Notes

Development notes for the message composer.

## Quill Composer

The quill composer uses the Quill rich text editor. Links to their [Website](https://quilljs.com/) and [github](https://github.com/quilljs/quill).

We wrap Quill's editor around a react component that can be imported and used by a react app. It's imported in [quill.js](../src/components/ComposerQuill/quill.js) and initialized in the [composer.js](../src/components/ComposerQuill/composer.js) `componentDidMount()`.

Libraries we use:

- [Markdown-it](https://github.com/markdown-it/markdown-it) to convert markdown text to html
- [Turndown](https://github.com/domchristie/turndown) to convert html back to markdown
- [Quill Mention](https://github.com/afry/quill-mention) to handle mentions

There are plenty of comments in the code to explain specific lines, so we won't go into that here. Instead we'll give some overall design choices.

### Sending the message

The `handleEnter()` function is executed when the user presses the enter key and thus it should call the `send()` function we receive. But we need to convert the contents of Quill's composer to text with html that can be displayed.

We start by [getting the text](#getting-the-text) of the composer. This gets the text with the mentions in a [placeholder string format](#mention-placeholder) that we will replace with element tags later. We do this so we don't interfere with the next step, which is converting the markdowns in the text to html tags. As we convert the markdown to text, we sanitize any left or right caret character to their respective html entity (< to \&lt; and > to \&gt;). We do this as to not confuse any user entered html tags to be confused with the ones markdown-it places in the text.

For example: if the user enters the text "This should \*\*not\*\* be \<strong\>bolded\</strong\>" then we'd expect the text to be "This should **not** be \<strong\>bolded\</strong\>" instead of "This should **not** be <strong>bolded</strong>".

After that we replace the mention placeholders we inserted previously with `<spark-mention>` tags. These are the tags that Webex Teams client use to indicate a mention in the text. We did it after so these tags wouldn't get converted to the caret html entity.

Afterwards we check if there are markdowns in the text or mentions. If there is, we strip all the tags from the text to use as the displayName. This text is what the user sees without any formatting. The content is way the client will display with the html tags.

If people were mentioned, then we include a list of people mentioned in the object. This is used to determine if someone was mentioned when they shouldn't be or whatnot.

Finally we call the `send()` function that should've been given through props. If the `send()` returns true then we clear the composer for the next message.

#### Getting the text

Quill uses [deltas](https://quilljs.com/docs/delta/) to describe the contents in their editor. They are a series of operations that represent the text. Quill's deltas have their own [standalone library](https://github.com/quilljs/delta/).

To keep things short, a simple delta looks like this:

```javascript
{
  ops: [
    {insert: 'Gandalf', attributes: {bold: true}},
    {insert: ' the '},
    {insert: 'Grey', attributes: {color: '#cccccc'}},
  ];
}
```

The string in the composer would be 'Gandalf the Grey' with 'Gandolf' bolded and 'Grey' in the color gray.

We can get the text in the editor by using Quill's [getText()](https://quilljs.com/docs/api/#gettext). The `getText()` function will go the deltas and check if the `insert` property is a string. If it is then it will append it to a string builder that gets returned.

A mention inside the composer would have a delta that looks like this:

```javascript
{
  ops: [
    {insert: 'Hello'},
    {insert: {
      mention: {
        index: '0',
        denotationChar: '@',
        id: '12345678-1234-1234-1234-1234567890ab',
        objectType: 'person',
        src: 'https://avatar.com/image',
        displayName: 'Pam Beesly',
        value: 'Pam',
      }
    },
  ];
}
```

The expecting string here is 'Hello Pam', but `getText()` would return 'Hello '. `getText()` doesn't include the mention obect in the text because it checks `typeof insert === 'string'`. Quill's default `getText()` doesn't know how to handle the mention object because it's from a different library. So we wrote our own.

The `getQuillText()` from the [utils file](../src/components/ComposerQuill/utils.js) copies the behaivor of the default `getText()` from Quill but changes how we handle mentions. Instead of skipping mentions, we insert a placeholder text for where the mention will be. This is an excellent segue into the next topic...

#### Mention placeholder

The mention placeholder is a string we use to indicate where a mention element needs to be.

A `<spark-mention>` element is used to represent a mention on Webex Teams. The element has a format like this:

```html
<spark-mention data-object-id="12345678-1234-1234-1234-1234567890ab" data-object-type="person">Pam</spark-mention>
```

There are three values a mention needs:

- data-object-id: if of the object (ex: '12345678-1234-1234-1234-1234567890ab')
- data-object-type: type of the object (ex: 'person')
- value: name of the object (ex: 'Pam')

The placeholder string has all of these information so we can convert it to the mention element. The format for the placeholder string is:

```
@{value_type_id}
```

The placeholder text for the `<spark-mention>` element above would be:

```
@{Pam_person_12345678-1234-1234-1234-1234567890ab}
```

#### Mention list item

The items in the mention list are rendered by setting the [innerHTML directly](https://github.com/afry/quill-mention/blob/master/src/quill.mention.js#L286) like this:

```javascript
li.innerHTML = this.options.renderItem(data[i], searchTerm);
```

The function `handleMentionItem()` has to return HTML code for us to display. Currently we pass the src of the avatar image as part of the participant item, then we use that to build the mention item with avatar. If there is no avatar, then we display their initials. The styling is meant to look like the avatars from [momentum ui](https://github.com/momentum-design/momentum-ui/tree/master/react/src/lib/Avatar).

Initially we wanted to convert the client's avatar component to HTML so we can keep momentum's logic and the popover that was wrapping it. I tried using `ReactDOM.render()` and `ReactDOMServer.renderToStaticMarkup()` but neither worked the way we wanted. We may revisit this someday as we want the contact card popover on the avatars.