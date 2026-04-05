import { RouterProvider } from 'react-router-dom';
import appRouter from '../router/appRouter';
import AppThemeProvider from './AppThemeProvider';
import DateProvider from './DateProvider';

export default function AppProvider() {
  return (
    <AppThemeProvider>
      <DateProvider>
        <RouterProvider router={appRouter} />
      </DateProvider>
    </AppThemeProvider>
  );
}

/*

      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              height: '100dvh',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h1 style={{ fontSize: '2.5dvh', fontWeight: 'bold' }}>Loading...</h1>
          </div>
        }
      >
      </Suspense>

*/
