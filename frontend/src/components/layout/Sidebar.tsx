import { NavLink, useLocation } from "react-router-dom";
import { FileText, MessageSquare, UploadCloud, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/globalStore";

const Sidebar = () => {
    const { menu, toggleMenu } = useGlobalStore();
    const location = useLocation();

    const sidebarItems = [
        { href: "/dashboard", label: "Dashboard", icon: FileText },
        { href: "/pdf", label: "My PDF", icon: MessageSquare },
    ];

    return (
        <>
            {/* Floating Mobile toggle button */}
            <Button
                variant="ghost"
                onClick={toggleMenu}
                className="md:hidden fixed top-4 left-4 z-50 shadow-lg p-2 rounded-full"
            >
                <Menu size={24} />
            </Button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 w-0 md:w-64 h-screen bg-card border-r border-border flex flex-col transition-transform
          ${menu ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
          w-64 md:w-64 shadow-lg md:shadow-none`}
            >
                {/* Mobile close button */}
                <div className="md:hidden flex justify-end p-2 border-b border-border">
                    <Button variant="ghost" onClick={toggleMenu}>
                        <X size={24} />
                    </Button>
                </div>

                {/* App Name */}
                <div className="p-4 border-b border-border">
                    <h2 className="text-lg font-bold text-center md:text-left">Revision App</h2>
                </div>

                {/* Upload PDF button */}
                <div className="p-4 border-b border-border">
                    <Button
                        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => {
                            /* handle upload */
                        }}
                    >
                        <UploadCloud size={20} /> Upload PDF
                    </Button>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 flex flex-col p-2 mt-2">
                    {sidebarItems.map(({ href, label, icon: Icon }) => {
                        const isActive = location.pathname === href;
                        return (
                            <NavLink
                                key={href}
                                to={href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                                        ? "bg-primary text-primary-foreground font-semibold"
                                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                                    }`}
                                onClick={() => menu && toggleMenu()} // close menu on mobile
                            >
                                <Icon size={20} />
                                <span className="text-sm">{label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile overlay */}
            {menu && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 md:hidden"
                    onClick={toggleMenu}
                />
            )}
        </>
    );
};

export default Sidebar;