import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex itesms-center gap-x-4 hover:opacity-75 transition">
        <div className="bg-white rounded-full p-1">
          <Image src="/language.svg" alt="Langsuit" height="32" width={"32"} />
        </div>
        <div className={cn(font.className)}>
          <p className="text-lg font-semibold">Langsuit</p>
          <p className="text-xs text-muted-foreground">Let&apos;s Learn</p>
        </div>
      </div>
    </Link>
  );
};
