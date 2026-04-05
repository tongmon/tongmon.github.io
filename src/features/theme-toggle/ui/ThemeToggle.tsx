import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSunHigh } from "@tabler/icons-react";

export default function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme("light");
  const isDark = colorScheme === "dark";

  return (
    <ActionIcon
      aria-label="Toggle color scheme"
      onClick={() => {
        setColorScheme(isDark ? "light" : "dark");
      }}
      radius="xl"
      size="lg"
      variant="default"
    >
      {isDark ? <IconSunHigh size={18} /> : <IconMoonStars size={18} />}
    </ActionIcon>
  );
}
