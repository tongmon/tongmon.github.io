import {
  createTheme,
  rem,
  type CSSVariablesResolver,
  type MantineColorsTuple,
} from "@mantine/core";

const brand: MantineColorsTuple = [
  "#edf8f4",
  "#d9f0e6",
  "#b4e2ce",
  "#8ad2b5",
  "#69c59f",
  "#54bc92",
  "#49a882",
  "#3c9472",
  "#2f8062",
  "#1f6a50",
];

export const theme = createTheme({
  primaryColor: "brand",
  colors: {
    brand,
  },
  fontFamily:
    '"Manrope", "Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif',
  fontFamilyMonospace:
    '"IBM Plex Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace',
  headings: {
    fontFamily: '"Instrument Serif", Georgia, serif',
    //sizes: {
    //  h1: { fontSize: rem(44), lineHeight: "1.05", fontWeight: "500" },
    //  h2: { fontSize: rem(34), lineHeight: "1.1", fontWeight: "500" },
    //  h3: { fontSize: rem(26), lineHeight: "1.15", fontWeight: "500" },
    //  h4: { fontSize: rem(22), lineHeight: "1.2", fontWeight: "500" },
    //  h5: { fontSize: rem(18), lineHeight: "1.25", fontWeight: "600" },
    //  h6: { fontSize: rem(16), lineHeight: "1.3", fontWeight: "600" },
    //},
  },
  // radius: {
  //   md: rem(16),
  //   xl: rem(28),
  // },
  defaultRadius: "md",
  components: {
    AppShell: {
      defaultProps: {
        padding: 0,
      },
    },
    Button: {
      defaultProps: {
        radius: "xl",
      },
    },
    Card: {
      defaultProps: {
        radius: "xl",
        withBorder: true,
      },
    },
    Badge: {
      defaultProps: {
        radius: "xl",
        variant: "light",
      },
    },
    Paper: {
      defaultProps: {
        radius: "xl",
      },
    },
  },
});

export const cssVariablesResolver: CSSVariablesResolver = (mantineTheme) => ({
  variables: {
    "--app-shell-max-width": rem(1180),
    "--app-gradient":
      "radial-gradient(circle at top left, rgba(84, 188, 146, 0.18), transparent 34%), radial-gradient(circle at top right, rgba(35, 95, 78, 0.1), transparent 28%)",
    "--app-grid-border": "rgba(15, 23, 42, 0.08)",
    "--app-muted-border": "rgba(15, 23, 42, 0.1)",
    "--app-soft-shadow": "0 24px 80px rgba(15, 23, 42, 0.08)",
    "--app-nav-width": "300px",
  },
  light: {
    "--mantine-color-body": "#f4f2ec",
    "--mantine-color-text": "#15211c",
    "--app-surface-0": "rgba(255, 255, 255, 0.78)",
    "--app-surface-1": "rgba(255, 255, 255, 0.94)",
    "--app-surface-2": "#ffffff",
    "--app-nav-active-bg": "rgba(84, 188, 146, 0.14)",
    "--app-nav-active-border": "rgba(84, 188, 146, 0.24)",
    "--app-muted": "#5a655f",
    "--app-code-bg": "#f7f9fb",
    "--app-code-border": "rgba(15, 23, 42, 0.1)",
    "--app-hero-ring": "rgba(84, 188, 146, 0.22)",
    "--app-anchor": mantineTheme.colors.brand[7],
  },
  dark: {
    "--mantine-color-body": "#101814",
    "--mantine-color-text": "#ecf2ee",
    "--app-grid-border": "rgba(226, 232, 240, 0.08)",
    "--app-muted-border": "rgba(226, 232, 240, 0.12)",
    "--app-surface-0": "rgba(18, 27, 22, 0.82)",
    "--app-surface-1": "rgba(18, 27, 22, 0.92)",
    "--app-surface-2": "#16211c",
    "--app-nav-active-bg": "rgba(84, 188, 146, 0.14)",
    "--app-nav-active-border": "rgba(84, 188, 146, 0.24)",
    "--app-muted": "#9ca8a1",
    "--app-code-bg": "#121b16",
    "--app-code-border": "rgba(226, 232, 240, 0.12)",
    "--app-hero-ring": "rgba(84, 188, 146, 0.14)",
    "--app-anchor": mantineTheme.colors.brand[3],
    "--app-soft-shadow": "0 24px 80px rgba(0, 0, 0, 0.32)",
  },
});
