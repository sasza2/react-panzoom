import React, { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import PanZoom from './PanZoom';
import Element from './Element';
import { PanZoomApi } from 'types';

const tick = () => new Promise((resolve) => { setTimeout(resolve, 0) });

const mockRect = (node: HTMLElement, rect: Partial<DOMRect>) => {
  vi.spyOn(node, 'getBoundingClientRect').mockReturnValue({
    left: 0, right: 50, top: 0, bottom: 50, width: 50, height: 50, x: 0, y: 0, ...rect,
  } as DOMRect);
};

it('Element renders children and unmounts cleanly', () => {
  const { container, unmount } = render(
    <PanZoom>
      <Element id="a">
        <span>content</span>
      </Element>
    </PanZoom>
  );

  expect(container.textContent).toBe('content');
  expect(() => unmount()).not.toThrow();
});

it('Element onClick, onMouseUp and onContextMenu callbacks fire', async () => {
  const onClick = vi.fn();
  const onMouseUp = vi.fn();
  const onContextMenu = vi.fn();

  const { container } = render(
    <PanZoom>
      <Element id="a" onClick={onClick} onMouseUp={onMouseUp} onContextMenu={onContextMenu}>
        <span>content</span>
      </Element>
    </PanZoom>
  );

  const elementNode = container.querySelector('.react-panzoom-element') as HTMLElement;
  mockRect(elementNode, {});

  fireEvent.mouseDown(elementNode, { clientX: 5, clientY: 5, buttons: 1 });
  expect(onClick).toHaveBeenCalled();
  await tick();

  fireEvent.mouseMove(window, { clientX: 15, clientY: 15, buttons: 1 });
  fireEvent.mouseUp(window, { clientX: 15, clientY: 15 });
  expect(onMouseUp).toHaveBeenCalled();

  fireEvent.contextMenu(elementNode, { clientX: 1, clientY: 1 });
  expect(onContextMenu).toHaveBeenCalled();
});

it('Element with family and followers can be dragged', async () => {
  const { container } = render(
    <PanZoom>
      <Element id="leader" x={0} y={0} followers={['follower']}>
        <span>leader</span>
      </Element>
      <Element id="follower" x={30} y={30} family="group-x">
        <span>follower</span>
      </Element>
      <Element id="sibling" x={30} y={30} family="group-x">
        <span>sibling</span>
      </Element>
    </PanZoom>
  );

  const leaderNode = container.querySelector('.react-panzoom-element');
  mockRect(leaderNode as HTMLElement, {});

  fireEvent.mouseDown(leaderNode, { clientX: 5, clientY: 5, buttons: 1 });
  await tick();
  fireEvent.mouseMove(window, { clientX: 15, clientY: 15, buttons: 1 });
  fireEvent.mouseUp(window);
  await tick();
});

it('Element disabled and disabledMove props are accepted', () => {
  const { container } = render(
    <PanZoom>
      <Element id="a" disabled disabledMove className="custom" zIndex={5}>
        <span>content</span>
      </Element>
    </PanZoom>
  );

  const elementNode = container.querySelector('.custom') as HTMLElement;
  expect(elementNode.style.zIndex).toBe('5');
});

it('Element disabledMoveHorizontal and disabledMoveVertical props are accepted', () => {
  const { container } = render(
    <PanZoom>
      <Element id="a" disabledMoveHorizontal disabledMoveVertical className="custom">
        <span>content</span>
      </Element>
    </PanZoom>
  );

  expect(container.querySelector('.custom')).toBeTruthy();
});

it('Element draggableSelector blocks drag from non-matching targets', () => {
  const onClick = vi.fn();

  const { container } = render(
    <PanZoom>
      <Element id="a" draggableSelector=".handle" onClick={onClick}>
        <span>content</span>
        <div className="handle">handle</div>
      </Element>
    </PanZoom>
  );

  const elementNode = container.querySelector('.react-panzoom-element') as HTMLElement;
  mockRect(elementNode, {});

  fireEvent.mouseDown(elementNode, { clientX: 5, clientY: 5, buttons: 1 });
  expect(onClick).not.toHaveBeenCalled();

  const handle = container.querySelector('.handle') as HTMLElement;
  fireEvent.mouseDown(handle, { clientX: 5, clientY: 5, buttons: 1 });
  expect(onClick).toHaveBeenCalled();
});

it('Element horizontal resizing fires onStartResizing and onAfterResize', () => {
  const onStartResizing = vi.fn();
  const onAfterResize = vi.fn();

  const { container } = render(
    <PanZoom>
      <Element
        id="a"
        resizable
        resizedMinWidth={10}
        resizedMaxWidth={200}
        onStartResizing={onStartResizing}
        onAfterResize={onAfterResize}
      >
        <span>content</span>
      </Element>
    </PanZoom>
  );

  const elementNode = container.querySelector('.react-panzoom-element') as HTMLElement;
  mockRect(elementNode, { left: 0, right: 100, width: 100 });

  const leftResizer = elementNode.children[1] as HTMLElement;
  fireEvent.mouseDown(leftResizer, { clientX: 0, clientY: 0, buttons: 1 });
  expect(onStartResizing).toHaveBeenCalled();
  fireEvent.mouseMove(window, { clientX: 10, clientY: 0, buttons: 1 });
  fireEvent.mouseUp(leftResizer);
  expect(onAfterResize).toHaveBeenCalled();
});

it('Element vertical resizing fires onStartResizing and onAfterResize', () => {
  const onStartResizing = vi.fn();
  const onAfterResize = vi.fn();

  const { container } = render(
    <PanZoom>
      <Element
        id="a"
        resizableVertical
        resizedMinHeight={10}
        resizedMaxHeight={200}
        onStartResizing={onStartResizing}
        onAfterResize={onAfterResize}
      >
        <span>content</span>
      </Element>
    </PanZoom>
  );

  const elementNode = container.querySelector('.react-panzoom-element') as HTMLElement;
  mockRect(elementNode, { top: 0, bottom: 100, height: 100 });

  const topResizer = elementNode.children[1] as HTMLElement;
  fireEvent.mouseDown(topResizer, { clientX: 0, clientY: 0, buttons: 1 });
  expect(onStartResizing).toHaveBeenCalled();
  fireEvent.mouseMove(window, { clientX: 0, clientY: 10, buttons: 1 });
  fireEvent.mouseUp(topResizer);
  expect(onAfterResize).toHaveBeenCalled();
});

it('Element updates options when props change after mount', async () => {
  const panZoomRef = createRef<PanZoomApi>();
  const { container, rerender } = render(
    <PanZoom ref={panZoomRef}>
      <Element id="a" x={0} y={0}>
        <span>content</span>
      </Element>
    </PanZoom>
  );
  await tick();

  rerender(
    <PanZoom ref={panZoomRef}>
      <Element id="a" x={10} y={10} resizable>
        <span>content</span>
      </Element>
    </PanZoom>
  );
  await tick();

  expect(container.querySelector('.react-panzoom-element')).toBeTruthy();
});
