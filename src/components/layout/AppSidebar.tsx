
"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";

export function AppSidebar() {
  return (
    <Sidebar 
      collapsible="icon"
      className="border-r border-sidebar-border/20 bg-gradient-to-b from-sidebar/98 to-sidebar/95 backdrop-blur-md shadow-xl transition-all duration-700 ease-in-out"
    >
      <SidebarHeader />
      <SidebarNavigation />
      <SidebarFooter />
    </Sidebar>
  );
}
