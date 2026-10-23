'use client';

import { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';

import { NAV_ITEMS } from '../constants/navItems';
import NavLink from './NavLink';

interface MobileMenuProps {
  pathname: string;
}

const MobileMenu = ({ pathname }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openedByKeyboardRef = useRef(false);
  const menuId = useId();

  // Close after a route change (e.g. back navigation) without an effect.
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  useEffect(
    function closeOnEscapeOrOutsideInteraction() {
      if (!isOpen) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;

        setIsOpen(false);
        buttonRef.current?.focus();
      };

      const handlePointerDown = (event: PointerEvent) => {
        if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('pointerdown', handlePointerDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('pointerdown', handlePointerDown);
      };
    },
    [isOpen],
  );

  useEffect(
    function focusFirstLinkWhenOpenedByKeyboard() {
      if (!isOpen || !openedByKeyboardRef.current) return;

      menuRef.current?.querySelector<HTMLElement>('a')?.focus();
    },
    [isOpen],
  );

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    // detail === 0 means the click came from the keyboard (Enter / Space).
    openedByKeyboardRef.current = event.detail === 0;
    setIsOpen((prev) => !prev);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
  };

  return (
    <div ref={rootRef} className="hidden xs:block" onBlur={handleBlur}>
      <button
        ref={buttonRef}
        type="button"
        aria-label="메뉴"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={handleToggle}
        className="flex items-center justify-center w-11 h-11 border cursor-pointer shrink-0 rounded-xl border-line bg-glass primary-button-hover focus-ring"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {isOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      <div
        ref={menuRef}
        id={menuId}
        tabIndex={-1}
        className={clsx(
          'absolute left-0 right-0 top-full mt-2 p-2 border rounded-2xl border-line glass-panel [--glass-alpha:0.96]',
          'transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none',
          isOpen
            ? 'visible opacity-100 translate-y-0'
            : 'invisible opacity-0 -translate-y-1',
        )}
      >
        <nav aria-label="모바일 메뉴">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  pathname={pathname}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center h-12 px-4 text-base font-medium rounded-xl text-muted transition-colors duration-300 hover:bg-accent-violet/10 hover:text-foreground focus-ring"
                  activeClassName="text-foreground bg-accent-violet/15"
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
