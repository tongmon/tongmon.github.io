import { Divider, NavLink, Text, ThemeIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import useNavbarStore from "../../model/useNavbarStore";
import type { NavbarItem, NavbarIconName } from "../../model/types";
import classes from "./NavbarLinksGroup.module.css";
import {
  IconAdjustments,
  IconBuildingWarehouse,
  IconCreditCardPay,
  IconCreditCardRefund,
  IconDashboard,
  IconLinkPlus,
  IconMessageUser,
  IconStackPush,
  TablerIcon,
} from "@tabler/icons-react";

const navbarIconMap: Record<NavbarIconName, TablerIcon> = {
  dashboard: IconDashboard,
  inventory: IconBuildingWarehouse,
  receiving: IconStackPush,
  order: IconCreditCardPay,
  return: IconCreditCardRefund,
  platforms: IconLinkPlus,
  cs: IconMessageUser,
  settings: IconAdjustments,
};

interface NavbarLinksGroupProps {
  navbarItem: NavbarItem;
  onNavigate?: () => void;
}

export default function NavbarLinksGroup({
  navbarItem,
  onNavigate,
}: NavbarLinksGroupProps) {
  const navigate = useNavigate();
  const hasLinks =
    navbarItem.type === "item" && Boolean(navbarItem.links?.length);
  const Icon =
    navbarItem.type === "item" && navbarItem.icon
      ? navbarIconMap[navbarItem.icon]
      : null;
  const activeItem = useNavbarStore((state) => state.activeItem);
  const [opened, { toggle }] = useDisclosure(
    Boolean(navbarItem.initiallyOpened),
  );

  const label =
    navbarItem.type === "item" ? (
      <Text fw={600} size="sm">
        {navbarItem.label}
      </Text>
    ) : null;

  const leftSection = Icon ? (
    <ThemeIcon className={classes["navlink-icon"]}>
      <Icon size={22} />
    </ThemeIcon>
  ) : null;

  if (navbarItem.type === "divider") {
    return <Divider my="md" size="xs" variant="dashed" />;
  }

  if (hasLinks) {
    return (
      <NavLink
        className={classes.navlink}
        onClick={toggle}
        opened={opened}
        label={label}
        leftSection={leftSection}
        active={activeItem === navbarItem.id}
      >
        {navbarItem.links?.map((item) => (
          <NavbarLinksGroup
            navbarItem={item}
            onNavigate={onNavigate}
            key={item.id}
          />
        ))}
      </NavLink>
    );
  }

  const link = navbarItem.link;

  if (link) {
    return (
      <NavLink
        className={classes.navlink}
        component="button"
        onClick={() => {
          navigate(link);
          onNavigate?.();
        }}
        label={label}
        leftSection={leftSection}
        active={activeItem === navbarItem.id}
      />
    );
  }

  return (
    <NavLink
      className={classes.navlink}
      component="button"
      label={label}
      leftSection={leftSection}
      active={activeItem === navbarItem.id}
    />
  );
}
