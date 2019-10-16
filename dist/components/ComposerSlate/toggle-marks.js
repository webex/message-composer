import isHotkey from 'is-hotkey';

const ToggleMarks = types => {
  return {
    onKeyDown(event, editor, next) {
      for (const type of Object.entries(types)) {
        if (isHotkey('mod+' + type[0], event)) {
          event.preventDefault();
          editor.toggleMark(type[1]);
          return;
        }
      }

      return next();
    }

  };
};

export default ToggleMarks;