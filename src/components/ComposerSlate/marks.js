import React from 'react';

export const Bold = (props) => (
  <strong>{props.children}</strong>
);

export const Italic = (props) => (
  <em>{props.children}</em>
);

export const Underline = (props) => (
  <u>{props.children}</u>
);

export const Code = (props) => (
  <code {...props.attributes}>{props.children}</code>
);