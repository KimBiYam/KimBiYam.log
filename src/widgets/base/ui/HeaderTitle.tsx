'use client';

import { useAtomValue } from 'jotai';
import * as m from 'motion/react-m';

import { headerTitleAtom } from '@src/features/post/client';
import { DURATION, EASE_OUT } from '@src/shared';

export default function HeaderTitle() {
  const { isShowTitle, title } = useAtomValue(headerTitleAtom);

  return (
    <div className="flex-1 min-w-0">
      {title && (
        <m.div
          initial="hidden"
          animate={isShowTitle ? 'show' : 'hidden'}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
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
      )}
    </div>
  );
}
