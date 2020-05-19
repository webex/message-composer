# Message Composer

Message composer for the Webex Web Client.

## Setup

You will need Node v11+ and Yarn installed.

## Usage

`yarn build` to build the composer.

To link with the client, run `yarn link` in your message composer terminal, then run `yarn link @webex/message-composer` in the client terminal.
You will need to build the composer after making changes for them to take effect. To unlink, run `yarn unlink @webex/message-composer` in the client terminal, then `yarn` to rebuild the original package from deployed package.

To test without linking to a client, run `yarn storybook`.

Example of usage in the client:

```javascript
import Composer from '@webex/message-composer';

// Prepare the functions and variables and whatnot

<Composer
  draft={draft}
  mentions={mentions}
  notifyKeyDown={onKeyDown}
  onError={onError}
  placeholder={placeholder}
  send={onSend}
  setEmitter={realSetEmitter}
  Toolbar={Toolbar}
>
  {stagedFiles}
  {quotedActivitySection}
</Composer>;
```

Or check out the [stories](src/index.stories.js) file.

## API

Check out the API docs [here](docs/api.md).

## Development

See the [development notes](docs/development.md) for more information.
