import React, {
  PropsWithChildren, forwardRef, useLayoutEffect, useState,
} from 'react';

import { PanZoomWithCoverProps, Size } from 'types';
import { ZOOM_INITIAL, ZOOM_MAX_DEFAULT } from '@/consts';
import { CLASS_NAME } from '@/styles';
import ElementsProvider from '@/ElementsProvider';
import PanZoomProvider, { usePanZoom } from '@/context';
import produceStyle from '@/helpers/produceStyle';
import { PanZoom } from '../PanZoom';

type WithCoverProps = {
  cover: string,
  onCoverLoad?: () => void,
  setScale: (scale: number) => void,
  setSize: (size: Size) => void,
}

const LoadCover: React.FC<PropsWithChildren<WithCoverProps>> = ({
  children,
  cover,
  onCoverLoad,
  setScale,
  setSize,
}) => {
  const { childRef, positionRef, zoomRef } = usePanZoom();

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

      setSize(imageSize);

      const scale = Math.max(
        containerSize.width / imageSize.width,
        containerSize.height / imageSize.height,
      );

      setScale(scale);

      zoomRef.current = scale;
      childRef.current.style.transform = produceStyle({
        position: positionRef.current,
        zoom: scale,
      });
      childRef.current.style.backgroundImage = `url('${cover}')`;
      childRef.current.style.setProperty('--zoom', scale.toString());

      if (onCoverLoad) onCoverLoad();
    };
  }, [cover]);

  return children as React.ReactElement;
};

const PanZoomWithCoverContext = (
  {
    children,
    className,
    cover,
    onCoverLoad,
    zoomMax = ZOOM_MAX_DEFAULT,
    ...props
  }: PanZoomWithCoverProps,
  apiRef: PanZoomWithCoverProps['apiRef'],
) => {
  const [scale, setScale] = useState<number>(ZOOM_INITIAL);
  const [size, setSize] = useState<Size>({ width: '100%', height: '100%' });

  return (
    <PanZoomProvider
      apiRef={apiRef}
      {...props}
      boundary
      className={`${className || ''} ${CLASS_NAME}-with-cover`}
      width={size.width}
      height={size.height}
      zoomInitial={scale}
      zoomMin={scale}
      zoomMax={zoomMax * scale}
    >
      <ElementsProvider>
        <LoadCover
          cover={cover}
          onCoverLoad={onCoverLoad}
          setScale={setScale}
          setSize={setSize}
        >
          <PanZoom>{children}</PanZoom>
        </LoadCover>
      </ElementsProvider>
    </PanZoomProvider>
  );
};

export default forwardRef(PanZoomWithCoverContext);
