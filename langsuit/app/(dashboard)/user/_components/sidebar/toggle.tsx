"use client";

import { useInstructorSidebar } from "@/store/use-instructorsidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { Hint } from "@/components/hint";

export const Toggle = () => {
  const { collapsed, onExpand, onCollapse } = useInstructorSidebar(
    (state) => state,
  );

  const label = collapsed ? "Expand" : "Collape";

  return (
    <>
      {collapsed && (
        <Hint label={label} side="right" asChild>
          <div className="hidden lg:flex w-full items-center justfy-center pt-4 mb-4">
            <Button variant="ghost" onClick={onExpand} className="h-auto p-2">
              <ArrowRightFromLine />
            </Button>
          </div>
        </Hint>
      )}
      {!collapsed && (
        <div className="p-3 pl-6 mb-2 flex items-center w-full">
          <p className="font-semibold text-primary text-white">For you</p>
          <Hint label={label} side="right" asChild>
            <Button
              className="h-auto p-2 ml-auto"
              variant={"ghost"}
              onClick={onCollapse}
            >
              <ArrowLeftFromLine className="h-4 w-4" />
            </Button>
          </Hint>
        </div>
      )}
    </>
  );
};
