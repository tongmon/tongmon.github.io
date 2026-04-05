export type NavbarIconName =
  | 'dashboard'
  | 'inventory'
  | 'receiving'
  | 'order'
  | 'return'
  | 'platforms'
  | 'cs'
  | 'settings';

interface NavbarBaseItem {
  id: string;
  initiallyOpened?: boolean;
}

export interface NavbarDividerItem extends NavbarBaseItem {
  type: 'divider';
}

export interface NavbarLinkItem extends NavbarBaseItem {
  type: 'item';
  label: string;
  icon?: NavbarIconName;
  link?: string;
  links?: NavbarItem[];
}

export type NavbarItem = NavbarDividerItem | NavbarLinkItem;

export interface NavbarStoreState {
  navbarContent: NavbarItem[];
  activeItem: string | null;
  setNavbarContent: (content: NavbarItem[]) => void;
  setActiveItem: (itemId: string | null) => void;
}
