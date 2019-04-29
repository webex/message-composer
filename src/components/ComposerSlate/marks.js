import React from 'react';

export const Bold = ({attributes, children}) => (
  <strong {...attributes}>{children}</strong>
);

export const Italic = ({attributes, children}) => (
  <em {...attributes}>{children}</em>
);

export const Underline = ({attributes, children}) => (
  <u {...attributes}>{children}</u>
);

export const Code = ({attributes, children}) => (
  <code {...attributes}>{children}</code>
);

export const Blockquote = ({attributes, children})  => (
  <blockquote {...attributes}>{children}</blockquote> 
);

export const H1 = ({attributes, children})  => (
  <h1 {...attributes}>{children}</h1> 
);

export const H2 = ({attributes, children})  => (
  <h2 {...attributes}>{children}</h2> 
);

export const H3 = ({attributes, children})  => (
  <h3 {...attributes}>{children}</h3> 
);
