import type { ReactNode } from "react";
import {
  ColorSchemeScript,
  localStorageColorSchemeManager,
  MantineProvider,
} from "@mantine/core";
import { cssVariablesResolver, theme } from "@/app/theme";

interface AppThemeProviderProps {
  children: ReactNode;
}

const colorSchemeManager = localStorageColorSchemeManager({
  key: "tongmon-blog-color-scheme",
});

export default function AppThemeProvider({
  children,
}: AppThemeProviderProps) {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider
        colorSchemeManager={colorSchemeManager}
        cssVariablesResolver={cssVariablesResolver}
        defaultColorScheme="auto"
        theme={theme}
      >
        {children}
      </MantineProvider>
    </>
  );
}
