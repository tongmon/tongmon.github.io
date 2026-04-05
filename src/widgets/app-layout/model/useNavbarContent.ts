import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import type { NavbarItem } from './types';
import useNavbarStore from './useNavbarStore';

const DEFAULT_ACTIVE_TAB = 'dashboard';

export default function useNavbarContent() {
  const location = useLocation();
  const { navbarContent, setActiveItem } = useNavbarStore(
    useShallow((state) => ({
      navbarContent: state.navbarContent,
      setActiveItem: state.setActiveItem,
    }))
  );

  const findCurrentActive = useCallback(
    (root: NavbarItem): string | null => {
      if (root.type === 'divider') return null;

      if (root.link && location.pathname.includes(root.link)) {
        return root.id;
      }

      if (root.links?.length) {
        for (const child of root.links) {
          const found = findCurrentActive(child);
          if (found) return found;
        }
      }

      return null;
    },
    [location.pathname]
  );

  useEffect(() => {
    let currentActive: string | null = null;

    for (const item of navbarContent) {
      currentActive = findCurrentActive(item);
      if (currentActive) break;
    }

    setActiveItem(currentActive ?? DEFAULT_ACTIVE_TAB);
  }, [findCurrentActive, navbarContent, setActiveItem]);

  return { navbarContent };
}
