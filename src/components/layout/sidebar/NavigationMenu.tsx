
"use client";

import { motion } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarMenu } from "@/components/ui/sidebar";
import { itemVariants } from "@/lib/animations";
import { NavigationItem } from "./NavigationItem";
import { navigationItems } from "./navigationData";

export function NavigationMenu() {
  return (
    <SidebarMenu className="space-y-2">
      {navigationItems.map((item, index) => (
        <motion.div
          key={item.title}
          variants={itemVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: index * 0.03 }}
        >
          <NavigationItem item={item} index={index} />
        </motion.div>
      ))}
    </SidebarMenu>
  );
}
