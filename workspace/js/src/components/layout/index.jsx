import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";
import React from "react";

export default function Layout(){
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-700 dark:text-gray-200 transition-color duration-500 ease-in-out">
      <Header />
      <React.Suspense fallback={Spinner.WithHeader}>
        <Outlet />
      </React.Suspense>
      <Footer />
    </div>
  );
}