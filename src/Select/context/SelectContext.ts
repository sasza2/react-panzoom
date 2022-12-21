import { createContext, MutableRefObject } from 'react';

import { Position } from 'types';

export type MoveRef = MutableRefObject<(position: Position) => void>;

export type Boundary = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type SelectContextType = {
  boundary: Boundary;
  setBoundary: (boundary: Boundary) => void;
  expandingRef: MutableRefObject<HTMLDivElement>;
  movingRef: MutableRefObject<HTMLDivElement>;
  selectRef: MutableRefObject<HTMLDivElement>;
  move: Position | null;
  setMove: (position: Position | null) => void;
};

const SelectContext = createContext<SelectContextType>({} as SelectContextType);

export default SelectContext;
