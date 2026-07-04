import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSidebar } from "@/hooks/useSidebar";

export default function DashboardLayout() {
  const { collapsed, toggle } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onToggleSidebar={toggle} />
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="container mx-auto p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
