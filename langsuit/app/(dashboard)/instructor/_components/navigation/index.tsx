"use client";

import { cn } from "@/lib/utils";
import { useInstructorSidebar } from "@/store/use-instructorsidebar";
import axios from "axios";
import { Fullscreen, KeyRound, MessageSquare, Users } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavItem } from "../sidebar/nav-item";

export const Navigation = () => {
  const pathname = usePathname();
  const { username: paramUsername } = useParams();
  const [self, setSelf] = useState(null);
  const [loading, setLoading] = useState(true);
  const { collapsed } = useInstructorSidebar((state) => state);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post("/api/user", {
          username: paramUsername,
          role: "instructor",
        });
        // console.log(response);
        const { user } = response.data;
        setSelf(user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [paramUsername]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const routes = [
    {
      label: "Course",
      href: `/instructor/${paramUsername}`,
      icon: Fullscreen,
    },
    {
      label: "Live Stream",
      href: `/instructor/${paramUsername}/livestream`,
      icon: KeyRound,
    },
    {
      label: "Student Engagement",
      href: `/instructor/${paramUsername}/engagement`,
      icon: MessageSquare,
    },
    {
      label: "Revenue",
      href: `/instructor/${paramUsername}/revenue`,
      icon: Users,
    },
  ];

  // console.log(routes);
  return (
    <ul
      className={cn(
        "fixed mt-20 left-0 flex flex-col w-60 h-full bg-[#1a1c23] text-white border-r border-[#2D2E35] z-20",
        collapsed && "w-[70px]",
      )}
    >
      {routes.map((route, index) => (
        <NavItem
          key={route.href}
          label={route.label}
          icon={route.icon}
          href={route.href}
          isActive={pathname == route.href}
        />
      ))}
    </ul>
  );
};
