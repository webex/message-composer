import isHotkey from 'is-hotkey';

const ToggleMarks = (types) => ({
  onKeyDown(event, editor, next) {
    for (const type of Object.entries(types)) {
      if (isHotkey(`mod+${type[0]}`, event)) {
        event.preventDefault();
        editor.toggleMark(type[1]);

        return undefined;
      }
    }

    return next();
  },
});

export default ToggleMarks;
