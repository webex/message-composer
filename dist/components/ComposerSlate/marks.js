import React from 'react';
export const Bold = ({
  attributes,
  children
}) => React.createElement("strong", attributes, children);
export const Italic = ({
  attributes,
  children
}) => React.createElement("em", attributes, children);
export const Underline = ({
  attributes,
  children
}) => React.createElement("u", attributes, children);
export const Code = ({
  attributes,
  children
}) => React.createElement("code", attributes, children);
export const Blockquote = ({
  attributes,
  children
}) => React.createElement("blockquote", attributes, children);
export const H1 = ({
  attributes,
  children
}) => React.createElement("h1", attributes, children);
export const H2 = ({
  attributes,
  children
}) => React.createElement("h2", attributes, children);
export const H3 = ({
  attributes,
  children
}) => React.createElement("h3", attributes, children);