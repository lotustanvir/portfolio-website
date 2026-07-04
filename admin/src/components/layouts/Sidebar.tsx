import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  MessageSquare,
  Settings,
  ChevronLeft,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.PROJECTS, label: "Projects", icon: FolderKanban },
  { href: ROUTES.SKILLS, label: "Skills", icon: Code2 },
  { href: ROUTES.EXPERIENCE, label: "Experience", icon: Briefcase },
  { href: ROUTES.EDUCATION, label: "Education", icon: GraduationCap },
  { href: ROUTES.CERTIFICATES, label: "Certificates", icon: Award },
  { href: ROUTES.RESUME, label: "Resume", icon: FileText },
  { href: ROUTES.MESSAGES, label: "Messages", icon: MessageSquare },
  { href: ROUTES.SETTINGS, label: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
            P
          </div>
          <motion.span
            initial={false}
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
            }}
            className="text-sm font-semibold whitespace-nowrap"
          >
            Portfolio CMS
          </motion.span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));

            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <motion.span
                  initial={false}
                  animate={{
                    opacity: collapsed ? 0 : 1,
                    width: collapsed ? 0 : "auto",
                  }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Collapse toggle */}
      <div className="border-t px-2 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* User info */}
      <div className="border-t px-3 py-3">
        {collapsed ? (
          <button
            onClick={() => navigate(ROUTES.PROFILE)}
            className="mx-auto block"
            title={admin?.name}
          >
            <Avatar className="h-8 w-8">
              {admin?.profileImage ? (
                <AvatarImage src={admin.profileImage} alt={admin.name} />
              ) : null}
              <AvatarFallback className="text-xs">
                {admin?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              {admin?.profileImage ? (
                <AvatarImage src={admin.profileImage} alt={admin.name} />
              ) : null}
              <AvatarFallback className="text-xs">
                {admin?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{admin?.name}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">
                {admin?.role?.toLowerCase().replace("_", " ")}
              </p>
            </div>
            <button
              onClick={logout}
              className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
