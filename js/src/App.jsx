import { RouterProvider } from 'react-router-dom';
import router from '@/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useThemeStore from '@zustand/themeStore';

// react-query 사용
const queryClient = new QueryClient();

function App() {
  const { isDarkMode } = useThemeStore();

  if(isDarkMode){
    document.documentElement.classList.add('dark');
  }else{
    document.documentElement.classList.remove('dark');
  }
  
  return (
    <QueryClientProvider client={ queryClient }>
      <RecoilRoot>
        <React.Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={ router } />
        </React.Suspense>
      </RecoilRoot>
      <ReactQueryDevtools initialIsOpen={ false } />
    </QueryClientProvider>
  )
}

export default App;