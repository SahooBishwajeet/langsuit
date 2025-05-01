"use client";

import { cn } from "@/lib/utils";
import { useInstructorSidebar } from "@/store/use-instructorsidebar";

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  const { collapsed } = useInstructorSidebar((state) => state);
  return (
    <aside
      className={cn(
        "fixed left-0 flex flex-col w-60 h-full bg-[#1a1c23] text-white border-r border-[#2D2E35] z-20",
        collapsed && "w-[70px]",
      )}
    >
      {children}
    </aside>
  );
};
