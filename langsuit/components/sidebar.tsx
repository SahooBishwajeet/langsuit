import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import { SidebarItem } from "@/components/sidebar-item";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";

type Props = {
  className?: string;
};

export const SideBar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className,
      )}
    >
      <Link href="/">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/language.svg" height={40} width={40} alt="logo" />
          <h1 className="text-2xl font-extrabold text-cyan-600 tracking-wide">
            Langsuit
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="learn" href="/learn" iconSrc="/learn.svg" />
        <SidebarItem
          label="leaderboard"
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem label="quest" href="/quests" iconSrc="/quest.svg" />
        <SidebarItem
          label="alphabets"
          href="/alphabets"
          iconSrc="/alphabets.svg"
        />
        <SidebarItem label="shop" href="/shop" iconSrc="/shop.svg" />
        <SidebarItem label="tickets" href="/tickets" iconSrc="/tickets.svg" />
        <SidebarItem label="theatre" href="/theatre" iconSrc="/theatre.svg" />
        <SidebarItem label="faq" href="/faq" iconSrc="/faq.svg" />
        <SidebarItem
          label="feedback"
          href="/feedback"
          iconSrc="/feedback.svg"
        />
        <SidebarItem
          label="dashboard"
          href="/dashboard"
          iconSrc="/dashboard-alt.svg"
        />
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-8 w-8 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
};
