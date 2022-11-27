import React, { forwardRef, useLayoutEffect, useState } from 'react';

import { PanZoomWithCoverProps, Size } from 'types'
import { ZOOM_INITIAL, ZOOM_MAX_DEFAULT } from 'consts'
import { CLASS_NAME } from 'styles'
import ElementsProvider from '../ElementsProvider'
import PanZoomProvider, { usePanZoom } from '../context';
import { PanZoom } from '../PanZoom'
import produceStyle from '../helpers/produceStyle'

let WITH_COVER_ID = 0

type WithCoverProps = {
  cover: string,
  setScale: (scale: number) => void,
  setSize: (size: Size) => void,
}

const LoadCover: React.FC<WithCoverProps> = ({
  children,
  cover,
  setScale,
  setSize,
}) => {
  const { childRef, positionRef, zoomRef } = usePanZoom()

  useLayoutEffect(() => {
    const image = new Image();
    image.src = cover;
    image.onload = () => {
      const container = childRef.current.parentNode as HTMLElement;
      const containerSize = container.getBoundingClientRect();

      const imageSize = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      };

      setSize(imageSize)

      const scale = Math.max(
        containerSize.width / imageSize.width,
        containerSize.height / imageSize.height
      );

      setScale(scale)

      zoomRef.current = scale
      childRef.current.style.transform = produceStyle({ position: positionRef.current, zoom: scale });
      childRef.current.style.setProperty('--zoom', scale.toString());
    }
  }, [cover])

  return children as React.ReactElement
}

const PanZoomWithCoverContext = (
  { children, cover, zoomMax = ZOOM_MAX_DEFAULT, ...props }: PanZoomWithCoverProps,
  apiRef: PanZoomWithCoverProps['apiRef'],
) => {
  const [className] = useState(() => `${CLASS_NAME}-with-cover--id-${++WITH_COVER_ID}`)
  const [scale, setScale] = useState<number>(ZOOM_INITIAL)
  const [size, setSize] = useState<Size>({ width: '100%', height: '100%' });

  return (
    <>
      <style>{`
        .${className}__in {
          background-image: url('${cover}');
        }
      `}</style>
      <PanZoomProvider
        apiRef={apiRef}
        {...props}
        boundary
        className={`${props.className || ''} ${className}`}
        width={size.width}
        height={size.height}
        zoomInitial={scale}
        zoomMin={scale}
        zoomMax={zoomMax * scale}
      >
        <ElementsProvider>
          <LoadCover
            cover={cover}
            setScale={setScale}
            setSize={setSize}
          >
            <PanZoom>{children}</PanZoom>
          </LoadCover>
        </ElementsProvider>
      </PanZoomProvider>
    </>
  )
}

export default forwardRef(PanZoomWithCoverContext);
