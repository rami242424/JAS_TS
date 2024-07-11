import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-700 dark:text-gray-200 transition-color duration-500 ease-in-out">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout;