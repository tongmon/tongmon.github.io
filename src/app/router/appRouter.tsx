import { Center, LoadingOverlay } from "@mantine/core";
import { createHashRouter } from "react-router-dom";
import routeModules from "./routeModules";

const hydrateFallbackElement = (
  <Center>
    <LoadingOverlay
      visible
      overlayProps={{ radius: "sm", blur: 2 }}
      loaderProps={{ type: "bars", size: "lg" }}
    />
  </Center>
);

const appRouter = createHashRouter([
  {
    path: "/",
    element: <routeModules.AppLayout />,
    hydrateFallbackElement,
    children: [
      {
        index: true,
        element: <routeModules.Home />,
      },
      {
        path: "home",
        element: <routeModules.Home />,
      },
    ],
  },
]);

export default appRouter;
