"use client";

import { LucideIcon } from "lucide-react";
import { useInstructorSidebar } from "@/store/use-instructorsidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavItemProps {
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
}: NavItemProps) => {
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
          <Icon className="h-4 w-4" />
          {!collapsed && (
            <span
              className={cn("z-100", isActive ? "text-black" : "text-white")}
            >
              {label}
            </span>
          )}
        </div>
      </Link>
    </Button>
  );
};
