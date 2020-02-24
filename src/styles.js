export const PARENT_STYLE = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  touchAction: 'none',
  WebkitFontSmoothing: 'antialiased',
};

export const CHILD_STYLE = {
  position: 'relative',
  transformOrigin: '0 0',
  pointerEvents: 'none',
  backgroundColor: '#ddd',
};

export const CHILD_DISABLED_STYLE = {
  '-webkit-touch-callout': 'none',
  '-webkit-user-select': 'none',
  '-khtml-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none',
};

export const ELEMENT_STYLE = {
  display: 'inline-block',
  position: 'absolute',
  left: 0,
  top: 0,
  'pointer-events': 'all',
};

export const ELEMENT_STYLE_DISABLED = {
  'pointer-events': 'none',
};
