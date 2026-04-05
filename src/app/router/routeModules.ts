import { lazy, type ComponentType, type LazyExoticComponent } from "react";

interface RouteModules {
  AppLayout: LazyExoticComponent<ComponentType>;
  Home: LazyExoticComponent<ComponentType>;
}

function createRouteModules(): RouteModules {
  const AppLayout = lazy(() =>
    import("@/widgets/app-layout").then((mod) => ({ default: mod.AppLayout })),
  );

  const Home = lazy(() =>
    import("@/pages/home").then((mod) => ({ default: mod.HomePage })),
  );

  return {
    AppLayout,
    Home,
  };
}

const routeModules = createRouteModules();

export default routeModules;
