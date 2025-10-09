import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import UserMenuSimple from "@/components/user-dropdown-01";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map route paths to display names
  const routeTitles: Record<string, string> = {
    "/dashboard": "My PDFs",
    "/pdf": "Chat / Quiz",
    "/": "Home",
  };

  const currentTitle = routeTitles[location.pathname] || "";

  // Show back button on all pages except dashboard/home
  const showBackButton = !["/dashboard", "/"].includes(location.pathname);

  return (
    <header className="flex items-center justify-between bg-card border-b border-border px-4 py-2 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-2">
        {/* App name on mobile */}
        <span className="text-lg font-bold text-center ml-16 md:ml-0">Revision App</span>

        {/* Current route title on desktop */}
        {/* <span className="hidden md:block text-lg font-semibold">
          {currentTitle}
        </span> */}
        <div className="md:w-32"></div>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-2 rounded-md "
        >
          <ChevronLeft size={24} />
        </Button>
      </div>

      {/* User Dropdown */}
      <UserMenuSimple />
    </header>
  );
};

export default Header;
