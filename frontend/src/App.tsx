import { Outlet } from "react-router-dom";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header"; // acting like Navbar

const navbarHeight = "4rem"; // adjust if your Header height differs

export default function Layout () {
  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Navbar fixed on top */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </header>

      <div className="flex flex-1 pt-[calc(var(--navbar-height,4rem))]">
        {/* Sidebar fixed on left */}
        <aside className="md:w-64 fixed top-[var(--navbar-height,4rem)] left-0 bottom-0 overflow-y-auto border-r bg-white">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-64 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
