import { type ReactNode, Suspense } from "react";
import {
  Center,
  ColorSchemeScript,
  LoadingOverlay,
  MantineProvider,
} from "@mantine/core";
import { theme, resolver } from "@/app/theme";

interface AppThemeProviderProps {
  children: ReactNode;
}

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <>
      <ColorSchemeScript forceColorScheme="light" />
      <MantineProvider
        forceColorScheme="light"
        theme={theme}
        cssVariablesResolver={resolver}
      >
        <Suspense
          fallback={
            <Center>
              <LoadingOverlay
                visible
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ type: "bars" }}
              />
            </Center>
          }
        >
          {children}
        </Suspense>
      </MantineProvider>
    </>
  );
}
