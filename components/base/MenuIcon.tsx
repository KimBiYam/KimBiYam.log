import { motion, SVGMotionProps } from 'framer-motion';

type menuIconProps = {
  isOpen: boolean;
};

const MenuIcon = ({ isOpen }: menuIconProps) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      className="item w-5 h-5"
      animate={isOpen ? 'open' : 'closed'}
      fill="none"
      stroke="currentColor"
    >
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </motion.svg>
  );
};

const Path = (props: SVGMotionProps<SVGElement>) => (
  <motion.path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    {...props}
  />
);

export default MenuIcon;
