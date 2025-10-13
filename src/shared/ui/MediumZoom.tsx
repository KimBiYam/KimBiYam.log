'use client';

import React, { useEffect, useRef } from 'react';

import mediumZoom, { ZoomOptions } from 'medium-zoom';

import { isServer, mergeRefs } from '@src/shared';

interface MediumZoomProps<P> extends ZoomOptions {
  children: React.ReactElement<P>;
}

export default React.forwardRef(function MediumZoom<
  P,
  T extends HTMLImageElement,
>({ children, ...options }: MediumZoomProps<P>, ref: React.ForwardedRef<T>) {
  const zoomRef = useRef(isServer() ? null : mediumZoom(options));
  const imageRef = useRef<T>(null);

  useEffect(() => {
    const zoom = zoomRef.current;
    if (imageRef.current) zoom?.attach(imageRef.current);

    return () => {
      zoom?.detach();
    };
  }, []);

  useEffect(() => {
    zoomRef.current?.update(options);
  }, [options]);

  return (
    <>
      {React.cloneElement(children, {
        ...children.props,
        // eslint-disable-next-line react-hooks/refs
        ref: mergeRefs(ref, imageRef),
      })}
    </>
  );
});
