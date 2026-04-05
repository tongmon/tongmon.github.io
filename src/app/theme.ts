import {
  createTheme,
  type CSSVariablesResolver,
  type MantineColorsTuple,
  type MantineTheme,
} from "@mantine/core";

const primary: MantineColorsTuple = [
  "#ecf8ed",
  "#daf0dc",
  "#b6e1b8",
  "#8fd193",
  "#6ec372",
  "#4baf4f",
  "#419a45",
  "#37853b",
  "#2d7031",
  "#225b27",
];

const secondary: MantineColorsTuple = [
  "#f0f1f7",
  "#e0e3ef",
  "#c2c7df",
  "#a5abcd",
  "#949bb8",
  "#8c92ac",
  "#787e98",
  "#666b83",
  "#53586e",
  "#404559",
];

const tertiary: MantineColorsTuple = [
  "#feeeee",
  "#fddddd",
  "#f8b8b8",
  "#f29292",
  "#ec6c6c",
  "#d32f2f",
  "#bf2a2a",
  "#a82525",
  "#911f1f",
  "#7a1a1a",
];

const neutral: MantineColorsTuple = [
  "#f4f4f4",
  "#e7e6e6",
  "#cecdcd",
  "#b3b2b2",
  "#989696",
  "#7c7a7a",
  "#625f5f",
  "#494545",
  "#312d2d",
  "#1a1919",
];

const comboboxTransitionProps = {
  transition: "fade",
  duration: 150,
  timingFunction: "ease-out",
} as const;

const defaultComboboxProps = {
  withArrow: true,
  transitionProps: comboboxTransitionProps,
} as const;

const labeledInputStyles = (theme: MantineTheme) => ({
  label: {
    fontWeight: 600,
    marginLeft: theme.spacing.xs,
  },
});

const textareaStyles = (theme: MantineTheme) => ({
  ...labeledInputStyles(theme),
  description: { marginLeft: theme.spacing.xs },
});

const selectLikeStyles = (theme: MantineTheme) => ({
  ...labeledInputStyles(theme),
  input: { fontWeight: 600 },
  option: { fontWeight: 600 },
});

export const theme = createTheme({
  colors: {
    primary,
    secondary,
    tertiary,
    neutral,
  },
  primaryColor: "primary",
  primaryShade: { light: 5, dark: 6 },
  fontFamily: "Suit, Daydream, PixArrows, system-ui, sans-serif",
  autoContrast: true,
  luminanceThreshold: 0.3,
  components: {
    // Button: {
    //   defaultProps: { variant: "filled", radius: "md", color: "primary" },
    // },
    // TextInput: {
    //   defaultProps: { radius: "xl", fw: 600 },
    //   styles: labeledInputStyles,
    // },
    // NumberInput: {
    //   defaultProps: { radius: "xl", fw: 600 },
    //   styles: labeledInputStyles,
    // },
    // PasswordInput: {
    //   defaultProps: { radius: "xl", fw: 600 },
    //   styles: labeledInputStyles,
    // },
    // Textarea: {
    //   defaultProps: { radius: "xl", fw: 600 },
    //   styles: textareaStyles,
    // },
    // Select: {
    //   defaultProps: {
    //     radius: "xl",
    //     allowDeselect: true,
    //     clearable: true,
    //     comboboxProps: defaultComboboxProps,
    //   },
    //   styles: selectLikeStyles,
    // },
    // MultiSelect: {
    //   defaultProps: {
    //     radius: "xl",
    //     clearable: true,
    //     comboboxProps: defaultComboboxProps,
    //   },
    //   styles: selectLikeStyles,
    // },
    // TagsInput: {
    //   defaultProps: {
    //     radius: "xl",
    //     clearable: true,
    //     comboboxProps: defaultComboboxProps,
    //   },
    //   styles: selectLikeStyles,
    // },
    // Autocomplete: {
    //   defaultProps: {
    //     radius: "xl",
    //     fw: 600,
    //     comboboxProps: defaultComboboxProps,
    //   },
    //   styles: selectLikeStyles,
    // },
    // PillsInput: {
    //   defaultProps: {
    //     radius: "xl",
    //     fw: 600,
    //   },
    //   styles: selectLikeStyles,
    // },
    // Badge: {
    //   defaultProps: { variant: "filled", radius: "sm", color: "primary" },
    // },
    // ThemeIcon: {
    //   defaultProps: { variant: "subtle", radius: "sm", color: "primary" },
    //   vars: () => ({
    //     root: {
    //       "--ti-color": "var(--mantine-color-text)",
    //     },
    //   }),
    // },
    // Card: {
    //   defaultProps: { radius: "xl" },
    // },
    // ActionIcon: {
    //   defaultProps: { variant: "subtle", radius: "xl" },
    // },
    // Burger: {
    //   defaultProps: { color: "primary" },
    // },
    // Loader: {
    //   defaultProps: { color: "primary", type: "bars" },
    // },
    // Pill: {
    //   defaultProps: {
    //     fw: 600,
    //     c: "var(--mantine-color-text-2)",
    //     bg: "var(--focused-color-0)",
    //   },
    // },
    // SegmentedControl: {
    //   defaultProps: {
    //     fw: 600,
    //     color: "primary",
    //     bg: "var(--navbar-color)",
    //     radius: "xl",
    //   },
    //   styles: {
    //     label: {
    //       fontWeight: 600,
    //     },
    //   },
    // },
    // DateInput: {
    //   defaultProps: { radius: "xl", fw: 600 },
    //   styles: labeledInputStyles,
    // },
    // TimePicker: {
    //   defaultProps: { radius: "xl", fw: 600 },
    //   styles: labeledInputStyles,
    // },
  },
});

const getAppColorVariables = (theme: MantineTheme): Record<string, string> => {
  const variables: Record<string, string> = {};

  for (let i = 0; i < 10; i += 1) {
    variables[`--app-color-${i}`] = theme.colors.primary[i];
    variables[`--app-color-${i + 10}`] = theme.colors.secondary[i];
    variables[`--app-tertiary-${i}`] = theme.colors.tertiary[i];
    variables[`--app-neutral-${i}`] = theme.colors.neutral[i];
  }

  return variables;
};

const getSchemeVariables = (theme: MantineTheme): Record<string, string> => ({
  "--mantine-color-body": theme.colors.secondary[0],
  "--mantine-color-text": theme.colors.neutral[9],
  "--mantine-color-text-1": theme.colors.neutral[9],
  "--mantine-color-text-2": "var(--mantine-color-white)",

  "--surface-color-0": theme.colors.secondary[0],
  "--surface-color-1": "var(--mantine-color-white)",

  "--focused-color-0": theme.colors.primary[5],

  "--navbar-color": "var(--mantine-color-white)",
  "--header-color": theme.colors.secondary[1],

  "--nl-hover-bg": theme.colors.secondary[1],
  "--nl-hover-text": theme.colors.primary[6],
  "--nl-active-bg": theme.colors.primary[5],
  "--nl-active-text": "var(--mantine-color-white)",

  ...getAppColorVariables(theme),
});

export const resolver: CSSVariablesResolver = (theme) => {
  const schemeVariables = getSchemeVariables(theme);

  return {
    variables: {
      "--header-height": "clamp(52px, 7dvh, 68px)",
      "--navbar-width": "clamp(220px, 24dvw, 300px)",
    },
    light: { ...schemeVariables },
    dark: { ...schemeVariables },
  };
};
