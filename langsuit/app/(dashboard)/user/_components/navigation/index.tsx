"use client";

import { cn } from "@/lib/utils";
import { useInstructorSidebar } from "@/store/use-instructorsidebar";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { BookOpen, Compass, Globe, Trophy } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavItem } from "../sidebar/nav-item";

class User {
  username: string;
  role: string;
  userId: number;
  languageId: number | null;

  constructor(username: string, role: string) {
    this.username = username;
    this.role = role;
    this.userId = 0;
    this.languageId = null;
  }

  async fetchUser() {
    try {
      const response = await axios.post("/api/user", {
        username: this.username,
        role: this.role,
      });
      const { user } = response.data;
      this.userId = user.id;
      this.username = user.username;

      await this.fetchLanguageProgress();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async fetchLanguageProgress() {
    try {
      const languageProgress = await axios.get(
        `/api/user/${this.userId}/language-progress`,
      );
      if (languageProgress.data?.length > 0) {
        this.languageId = languageProgress.data[0].languageId; // Example: Set first languageId
      }
    } catch (error) {
      console.error("Error fetching language progress:", error);
      throw error;
    }
  }
}

export const Navigation = () => {
  const pathname = usePathname();
  const { user } = useUser();
  console.log(user?.username);
  // const { username: paramUsername } =  useParams();
  //const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { collapsed } = useInstructorSidebar((state) => state);
  // useEffect(() => {
  //     const fetchUser = async () => {
  //         try {
  //             const response = await axios.post('/api/user', {
  //                 username: paramUsername,
  //                 role: "instructor"
  //             });
  //             const {user} = response.data;
  //             setUser(user);
  //             setLoading(false);
  //         } catch (error) {
  //             console.error('Error fetching user:', error);
  //             setLoading(false);
  //         }
  //     };

  //     fetchUser();
  // }, [paramUsername]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const userRoutes = [
    {
      label: "Leaderboard",
      href: `/user/${user?.username}/leaderboard`, // Correct path
      icon: Trophy,
    },
    {
      label: "Languages",
      href: `/user/${user?.username}/languages`,
      icon: Globe,
    },
    {
      label: "Your Progress",
      href: `/user/${user?.username}/progress`,
      icon: BookOpen,
    },
    {
      label: "Quests",
      href: `/user/${user?.username}/quests`, // Correct path
      icon: Compass,
    },
  ];

  return (
    <ul
      className={cn(
        "fixed mt-20 left-0 flex flex-col w-60 h-full bg-[#1a1c23] text-white border-r border-[#2D2E35] z-20",
        collapsed && "w-[70px]",
      )}
    >
      {userRoutes.map((route, index) => (
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
