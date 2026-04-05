import { ActionIcon, Burger, Flex } from "@mantine/core";
import type { ActionIconProps } from "@mantine/core";
import { IconBell, IconSettings } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import classes from "./LayoutHeader.module.css";

interface LayoutHeaderProps {
  mobileOpened: boolean;
  toggleMobile: () => void;
  desktopOpened: boolean;
  toggleDesktop: () => void;
}

const actionIconVars: ActionIconProps["vars"] = () => ({
  root: {
    "--ai-bg": "var(--mantine-color-white)",
    "--ai-color": "var(--mantine-color-text)",
    "--ai-hover": "var(--mantine-color-gray-4)",
  },
});

export default function LayoutHeader({
  mobileOpened,
  toggleMobile,
  desktopOpened,
  toggleDesktop,
}: LayoutHeaderProps) {
  const navigate = useNavigate();

  return (
    <Flex
      h="100%"
      w="100%"
      align="center"
      px={{ base: "sm", sm: "xl" }}
      gap="sm"
      className={classes.header}
    >
      <Burger
        hiddenFrom="sm"
        opened={mobileOpened}
        onClick={toggleMobile}
        size="sm"
        aria-label="Toggle navigation on mobile"
      />

      <Burger
        visibleFrom="sm"
        opened={desktopOpened}
        onClick={toggleDesktop}
        size="sm"
        aria-label="Toggle navigation on desktop"
      />

      <ActionIcon
        aria-label="Notification"
        radius="xl"
        ml="auto"
        variant="subtle"
        vars={actionIconVars}
      >
        <IconBell size={16} />
      </ActionIcon>

      <ActionIcon
        aria-label="Settings"
        radius="xl"
        variant="subtle"
        vars={actionIconVars}
        onClick={() => {
          navigate("/app/settings/account");
        }}
      >
        <IconSettings size={16} />
      </ActionIcon>
    </Flex>
  );
}
