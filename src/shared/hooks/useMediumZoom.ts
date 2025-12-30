import { useLayoutEffect, useRef } from 'react';

import mediumZoom, { type Zoom, type ZoomOptions } from 'medium-zoom';
import 'medium-zoom/dist/style.css';

interface UseMediumZoomOptions {
  selector: string;
  options?: Partial<ZoomOptions>;
}
const useMediumZoom = ({ selector, options }: UseMediumZoomOptions) => {
  const zoomRef = useRef<Zoom>(mediumZoom(options));

  useLayoutEffect(() => {
    const zoom = zoomRef.current;
    const images = document.querySelectorAll(selector);
    if (images.length > 0) {
      zoom.attach(images);
    }

    return () => {
      zoom.detach(images);
    };
  }, [selector]);

  useLayoutEffect(() => {
    if (options) {
      zoomRef.current?.update(options);
    }
  }, [options]);
};

export default useMediumZoom;
