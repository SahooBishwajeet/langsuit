"use client";

import { Navbar } from "../_components/navbar/index";
import { Sidebar } from "../_components/sidebar/index";
import { Container } from "../_components/container/index";
import { useInstructorSidebar } from "@/store/use-instructorsidebar";
import { instructorUser } from "@/utils/dbOrchestrator";
import { Navigation } from "../_components/navigation/index";

interface InstructorLayoutProps {
  params: { username: string };
  children: React.ReactNode;
}
const InstructorLayout = ({ params, children }: InstructorLayoutProps) => {
  const self = instructorUser.instance.getSelfByUsername(params.username);
  // console.log(self);
  console.log(params.username);
  return (
    <div className="h-screen w-screen bg-[#101214]">
      <Navbar />
      <div className="flex h-full pt-20">
        <Sidebar />
        <Navigation />
        <Container>{children}</Container>
      </div>
    </div>
  );
};

export default InstructorLayout;
