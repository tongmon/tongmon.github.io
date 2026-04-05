import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import LayoutHeader from "../LayoutHeader/LayoutHeader";
import LayoutNavbar from "../LayoutNavbar/LayoutNavbar";

export default function AppLayout() {
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      layout="default"
      header={{ height: "var(--header-height)" }}
      navbar={{
        width: "var(--navbar-width)",
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      withBorder={false}
    >
      <AppShell.Header>
        <LayoutHeader
          mobileOpened={mobileOpened}
          toggleMobile={toggleMobile}
          desktopOpened={desktopOpened}
          toggleDesktop={toggleDesktop}
        />
      </AppShell.Header>
      <AppShell.Navbar>
        <LayoutNavbar onNavigate={closeMobile} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
