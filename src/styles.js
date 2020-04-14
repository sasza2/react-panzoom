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

export const ELEMENT_STYLE_DISABLED = { // todo
  pointerEvents: 'none',
};

export const SELECT_STYLE = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
};

export const SELECT_BOX_STYLE = {
  backgroundColor: '#ccc',
  opacity: 0.5,
};
