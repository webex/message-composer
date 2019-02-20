const ToggleMarks = (types) => {
  return {
    onKeyDown(event, editor, next) {
      if (!event.metaKey) return next();
  
      for (const type of Object.entries(types)) {
        if (event.key === type[0]) {
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