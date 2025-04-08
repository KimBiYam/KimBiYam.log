'use client';

import { useAtomValue } from 'jotai';
import { domAnimation, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';

import { headerTitleAtom } from '@src/features/post/client';

export default function HeaderTitle() {
  const { isShowTitle, title } = useAtomValue(headerTitleAtom);

  return (
    <div className="flex-1 pl-4">
      {title && (
        <LazyMotion features={domAnimation} strict>
          <m.div
            initial="hidden"
            animate={isShowTitle ? 'show' : 'hidden'}
            transition={{ duration: 0.25 }}
            variants={{
              show: {
                display: 'block',
                opacity: 1,
                y: [10, 0],
              },
              hidden: {
                opacity: 0,
                y: [0, 10],
              },
            }}
          >
            <p className="font-bold xs:text-sm sm:text-sm line-clamp-2">
              {title}
            </p>
          </m.div>
        </LazyMotion>
      )}
    </div>
  );
}
