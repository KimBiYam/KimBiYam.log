import { memo } from 'react';

import favicon from '@src/assets/icon.png';

const Logo = () => (
  <a href="/" className="w-6 h-6">
    <img src={favicon.src} alt="logo" className="w-full h-full object-cover" />
  </a>
);

export default memo(Logo);
