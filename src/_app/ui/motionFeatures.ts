import { domAnimation } from 'motion/react';

// Kept in its own module so webpack emits the animation features as an async
// chunk; see ClientRootLayout.tsx.
export default domAnimation;
