import { serial } from "drizzle-orm/mysql-core";
import { create } from "zustand";

interface InstructorSidebarStore {
  collapsed: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export const useInstructorSidebar = create<InstructorSidebarStore>((set) => ({
  collapsed: false,
  onExpand: () => set(() => ({ collapsed: false })),
  onCollapse: () => set(() => ({ collapsed: true })),
}));
