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
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  KhtmlUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none',
};

export const ELEMENT_STYLE = {
  display: 'inline-block',
  position: 'absolute',
  left: 0,
  top: 0,
  pointerEvents: 'all',
};

export const ELEMENT_STYLE_DISABLED = {
  pointerEvents: 'none',
};
