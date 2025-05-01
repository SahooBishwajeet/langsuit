"use-client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInstructorSidebar } from "@/store/use-instructorsidebar";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface navItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
}

export const NavItem = ({
  icon: Icon,
  label,
  href,
  isActive,
}: navItemProps) => {
  const { collapsed } = useInstructorSidebar((state) => state);
  return (
    <Button
      asChild
      variant={"ghost"}
      className={cn(
        "w-full h-12",
        collapsed ? "justify-center" : "justify-start",
        isActive && "bg-accent",
      )}
    >
      <Link href={href}>
        <div className="flex items-center gap-x-4">
          <Icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")}></Icon>
          {!collapsed && <span>{label}</span>}
        </div>
      </Link>
    </Button>
  );
};
