import { useLayoutEffect, useRef } from 'react';

import mediumZoom, { type Zoom, type ZoomOptions } from 'medium-zoom';
import 'medium-zoom/dist/style.css';

interface UseMediumZoomOptions {
  selector: string;
  options?: Partial<ZoomOptions>;
}
const useMediumZoom = ({ selector, options }: UseMediumZoomOptions) => {
  const zoomRef = useRef<Zoom | null>(null);

  useLayoutEffect(() => {
    // 처음 한 번만 생성
    if (!zoomRef.current) {
      zoomRef.current = mediumZoom(options);
    }

    const zoom = zoomRef.current;
    const images = document.querySelectorAll(selector);
    if (images.length > 0) {
      zoom.attach(images);
    }

    return () => {
      zoom.detach(images);
    };
  }, [options, selector]);

  useLayoutEffect(() => {
    if (options) {
      zoomRef.current?.update(options);
    }
  }, [options]);
};

export default useMediumZoom;
