import {
  ActionIcon,
  type ActionIconProps,
  type ElementProps,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoonStars, IconSunHigh } from "@tabler/icons-react";

export interface ThemeToggleProps
  extends Omit<ActionIconProps, "children">,
    ElementProps<"button", keyof ActionIconProps> {}

export default function ThemeToggle({
  "aria-label": ariaLabel = "Toggle color scheme",
  onClick,
  radius = "xl",
  size = "lg",
  variant = "default",
  ...others
}: ThemeToggleProps) {
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme("light");
  const isDark = colorScheme === "dark";

  return (
    <ActionIcon
      aria-label={ariaLabel}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          setColorScheme(isDark ? "light" : "dark");
        }
      }}
      radius={radius}
      size={size}
      variant={variant}
      {...others}
    >
      {isDark ? <IconSunHigh size={18} /> : <IconMoonStars size={18} />}
    </ActionIcon>
  );
}
