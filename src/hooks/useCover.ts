import { MutableRefObject, useEffect, useRef, useState } from 'react';
import type { API } from 'types';

const useCover = (
  imageUrl: string
): {
  size: { width: number; height: number };
  zoom: number;
  ref: MutableRefObject<API>;
} => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });
  const [zoom, setZoom] = useState(1);
  const apiRef = useRef<API>();

  useEffect(() => {
    const api = apiRef.current;

    if (!api) return;

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const container = api.ref().current.parentNode as Element;
      const containerSize = container.getBoundingClientRect();
      const imageSize = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      };
      const zoom = Math.max(
        containerSize.width / imageSize.width,
        containerSize.height / imageSize.height
      );

      setSize(imageSize);
      setZoom(zoom);
      api.setZoom(zoom);
    };
  }, [apiRef, apiRef.current]);

  return {
    size,
    zoom,
    ref: apiRef,
  };
};

export default useCover;
