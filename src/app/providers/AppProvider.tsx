import { Suspense } from "react";
import { Center, Loader } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import appRouter from "@/app/router/appRouter";
import AppThemeProvider from "@/app/providers/AppThemeProvider";

export default function AppProvider() {
  return (
    <AppThemeProvider>
      <Suspense
        fallback={
          <Center mih="100vh">
            <Loader />
          </Center>
        }
      >
        <RouterProvider router={appRouter} />
      </Suspense>
    </AppThemeProvider>
  );
}
