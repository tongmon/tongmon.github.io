import dayjs from "dayjs";

import "dayjs/locale/ko";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { DatesProvider } from "@mantine/dates";
import { ReactNode } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");
dayjs.tz.setDefault("Asia/Seoul");

interface DateProviderProps {
  children: ReactNode;
}

export default function DateProvider({ children }: DateProviderProps) {
  return <DatesProvider settings={{ locale: "ko" }}>{children}</DatesProvider>;
}
