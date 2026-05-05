import { Box, type BoxProps } from "@mantine/core";
import {
  motion,
  useReducedMotion,
  type MotionProps,
  type UseInViewOptions,
} from "framer-motion";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

type NativeDivProps = Omit<
  ComponentPropsWithoutRef<"div">,
  keyof BoxProps | keyof MotionProps | "style"
>;

interface RevealerProps extends Omit<BoxProps, "style">, NativeDivProps {
  children: ReactNode;
  delay?: number;
  from?: "bottom" | "right" | "top";
  style?: MotionProps["style"];
  viewportAmount?: UseInViewOptions["amount"];
  viewportMargin?: string;
}

const REVEAL_DELAY_BASE = 40;
const REVEAL_DELAY_STEP = 80;

export function getRevealDelay(index: number) {
  return REVEAL_DELAY_BASE + index * REVEAL_DELAY_STEP;
}

const BoxRoot = forwardRef<HTMLDivElement, RevealerProps>(
  ({ style, ...props }, ref) => (
    <Box ref={ref} style={style as BoxProps["style"]} {...props} />
  ),
);

const MotionBox = motion.create(BoxRoot);

export default function Revealer({
  children,
  delay = 0,
  from = "bottom",
  style,
  viewportAmount = "some",
  viewportMargin = "0px 0px -25% 0px",
  ...boxProps
}: RevealerProps) {
  const shouldReduceMotion = useReducedMotion();
  const offset =
    from === "right" ? { x: 48 } : { y: from === "top" ? -48 : 48 };
  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, ...offset };
  const whileInView = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, x: 0, y: 0 };

  return (
    <MotionBox
      w="100%"
      miw={0}
      {...boxProps}
      initial={initial}
      style={style}
      transition={{
        delay: shouldReduceMotion ? 0 : delay / 1000,
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: "easeOut",
      }}
      viewport={{ amount: viewportAmount, once: true, margin: viewportMargin }}
      whileInView={whileInView}
    >
      {children}
    </MotionBox>
  );
}
