import { m } from 'framer-motion';
import { useAtomValue } from 'jotai';

import headerTitleAtom from '../../atoms/headerTitleAtom';

export default function HeaderTitle() {
  const { isShowTitle, title } = useAtomValue(headerTitleAtom);

  const handleTitleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 pl-4 overflow-hidden xs:pl-2 sm:pl2">
      <m.p
        className="overflow-hidden cursor-pointer text-ellipsis whitespace-nowrap xs:text-sm sm:text-sm"
        initial="hidden"
        animate={isShowTitle ? 'show' : 'hidden'}
        transition={{ duration: 0.3 }}
        onClick={handleTitleClick}
        variants={{
          show: {
            display: 'block',
            opacity: 1,
            y: [-10, 0],
          },
          hidden: {
            transitionEnd: { display: 'none' },
            opacity: 0,
            y: [0, -10],
          },
        }}
      >
        {title}
      </m.p>
    </div>
  );
}
