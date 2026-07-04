import { useLocation, useNavigate } from "react-router-dom";
import { PanelLeft, Moon, Sun, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { BreadcrumbItem } from "@/components/ui/breadcrumb";

interface NavbarProps {
  onToggleSidebar: () => void;
}

const labelMap: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.PROJECTS]: "Projects",
  [ROUTES.SKILLS]: "Skills",
  [ROUTES.EXPERIENCE]: "Experience",
  [ROUTES.EDUCATION]: "Education",
  [ROUTES.CERTIFICATES]: "Certificates",
  [ROUTES.RESUME]: "Resume",
  [ROUTES.MESSAGES]: "Messages",
  [ROUTES.SETTINGS]: "Settings",
  [ROUTES.PROFILE]: "Profile",
};

function getBreadcrumbs(pathname: string): Array<{ href: string; label: string }> {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Array<{ href: string; label: string }> = [];

  // Always start with Dashboard for authenticated pages
  crumbs.push({ href: ROUTES.DASHBOARD, label: "Dashboard" });

  let current = "";
  for (const segment of segments) {
    current += `/${segment}`;
    // Skip the first segment if it's empty (from leading /)
    if (current === "/") continue;
    const label = labelMap[current] || segment.charAt(0).toUpperCase() + segment.slice(1);
    crumbs.push({ href: current, label });
  }

  return crumbs.slice(1); // Remove dashboard since we already have it as root
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="shrink-0"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} className="hidden sm:flex" />

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-7 w-7">
                {admin?.profileImage ? (
                  <AvatarImage src={admin.profileImage} alt={admin?.name} />
                ) : null}
                <AvatarFallback className="text-xs">
                  {admin?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{admin?.name}</span>
                <span className="text-xs font-normal text-muted-foreground capitalize">
                  {admin?.role?.toLowerCase().replace("_", " ")}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(ROUTES.SETTINGS)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
