import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export function useIsMobileViewport() {
  const theme = useMantineTheme();

  return useMediaQuery(`(max-width: ${theme.breakpoints.md})`, false, {
    getInitialValueInEffect: false,
  });
}
