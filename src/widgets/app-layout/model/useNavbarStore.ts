import { nanoid } from "nanoid";
import { create } from "zustand";
import type { NavbarItem, NavbarStoreState } from "./types";

const navbarContent: NavbarItem[] = [
  {
    type: "item",
    id: "some_tag",
    label: "\uB300\uC2DC\uBCF4\uB4DC",
    icon: undefined,
    link: "/some_tag",
  },
  // {
  //   type: 'item',
  //   id: 'inventory',
  //   label: '\uC0C1\uD488 \uBC0F \uC7AC\uACE0',
  //   icon: 'inventory',
  //   link: '/app/inventory',
  // },
  // {
  //   type: 'item',
  //   id: 'receiving',
  //   label: '\uC785\uACE0',
  //   icon: 'receiving',
  //   link: '/app/receiving',
  // },
  // { type: 'divider', id: `divider-${nanoid()}` },
  // { type: 'item', id: 'order', label: '\uC8FC\uBB38', icon: 'order', link: '/app/order' },
  // {
  //   type: 'item',
  //   id: 'return',
  //   label: '\uBC18\uD488',
  //   icon: 'return',
  //   links: [
  //     { type: 'item', id: 'refund', label: '\uD658\uBD88', link: '/app/return' },
  //     { type: 'item', id: 'exchange', label: '\uAD50\uD658', link: '/app/exchange' },
  //     { type: 'item', id: 'cancellation', label: '\uCDE8\uC18C', link: '/app/cancellation' },
  //   ],
  // },
  // { type: 'divider', id: `divider-${nanoid()}` },
  // {
  //   type: 'item',
  //   id: 'platforms',
  //   label: '\uC5F0\uB3D9',
  //   icon: 'platforms',
  //   link: '/app/platform-integration',
  // },
  // { type: 'item', id: 'cs', label: '\uBB38\uC758', icon: 'cs', link: '/app/cs' },
  // { type: 'divider', id: `divider-${nanoid()}` },
  // {
  //   type: 'item',
  //   id: 'settings',
  //   label: '\uC124\uC815',
  //   icon: 'settings',
  //   links: [
  //     {
  //       type: 'item',
  //       id: 'account',
  //       label: '\uACC4\uC815 \uAD00\uB9AC',
  //       link: '/app/settings/account',
  //     },
  //     {
  //       type: 'item',
  //       id: 'policy',
  //       label: '\uBC30\uC1A1\uC9C0 \uBC0F \uC815\uCC45',
  //       link: '/app/settings/policy',
  //     },
  //     { type: 'item', id: 'billing', label: '\uAD6C\uB3C5 \uBC0F \uACB0\uC81C', link: '/app/settings/billing' },
  //   ],
  // },
];

const useNavbarStore = create<NavbarStoreState>()((set) => ({
  navbarContent,
  activeItem: null,
  setNavbarContent: (content) => set({ navbarContent: content }),
  setActiveItem: (itemId) => set({ activeItem: itemId }),
}));

export default useNavbarStore;
