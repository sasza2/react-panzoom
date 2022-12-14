import { CSSProperties } from 'react';

export const CLASS_NAME = 'react-panzoom';

export const GRABBING_CLASS_NAME = `${CLASS_NAME}--grabbing`;

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

export const SELECT_STYLE: CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
};

export const SELECT_BOX_STYLE: CSSProperties = {
  backgroundColor: '#ccc',
  opacity: 0.5,
  zIndex: 2147483647,
};
