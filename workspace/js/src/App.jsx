import { RouterProvider } from 'react-router-dom';
import router from '@/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// react-query 사용
const  queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={ queryClient }>
      <RouterProvider router={ router } />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App;