"use client";

import React from "react";
import { ChevronDown, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fallback if user is not loaded yet
  const currentUser = user || { name: "John Doe", email: "example@test.com", avatar: "https://bundui-images.netlify.app/avatars/01.png" };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 px-2">
          <Avatar className="w-6 h-6 rounded-lg">
            {currentUser.avatar ? (
              <AvatarImage src={currentUser?.avatar} alt={currentUser.name} />
            ) : (
              <AvatarFallback className="rounded-lg">
                {currentUser.name?.charAt(0) || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="truncate">{currentUser.name}</div>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[240px] min-w-[240px] rounded-lg"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
            <Avatar className="w-8 h-8 rounded-lg">
              {currentUser.avatar ? (
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              ) : (
                <AvatarFallback className="rounded-lg">
                  {currentUser.name?.charAt(0) || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{currentUser.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {currentUser.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
