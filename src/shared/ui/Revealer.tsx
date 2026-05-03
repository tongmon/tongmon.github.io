import { Box, type BoxProps } from "@mantine/core";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
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
  style?: MotionProps["style"];
}

const REVEAL_DELAY_GAP = 80;
const ODD_CARD_REVEAL_DELAY = 40;
const EVEN_CARD_REVEAL_DELAY = ODD_CARD_REVEAL_DELAY + REVEAL_DELAY_GAP;

export function getRevealDelay(index: number, columns = 1) {
  if (columns <= 1) {
    return ODD_CARD_REVEAL_DELAY;
  }

  const cardNumber = index + 1;

  return cardNumber % 2 === 1 ? ODD_CARD_REVEAL_DELAY : EVEN_CARD_REVEAL_DELAY;
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
  style,
  ...boxProps
}: RevealerProps) {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 48 };
  const whileInView = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };

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
      viewport={{ once: true, margin: "0px 0px -25% 0px" }}
      whileInView={whileInView}
    >
      {children}
    </MotionBox>
  );
}
