import { cn } from "@/lib/utils";
import { useInstructorSidebar } from "@/store/use-instructorsidebar";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  const { collapsed } = useInstructorSidebar((state) => state);

  return (
    <div
      className={cn("flex-1", collapsed ? "ml-[70px]" : "ml-[70px] lg:ml-60")}
    >
      {children}
    </div>
  );
};
