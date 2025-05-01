import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      {/* Footer */}
      <div className="max-w-screen-2xl mx-auto flex items-center justify-evenly h-full">
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/US - United States.svg"
            alt="United States"
            width={30}
            height={30}
            className="mr-4 rounded-sm"
          />{" "}
          English
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/IN - India.svg"
            alt="India"
            width={30}
            height={30}
            className="mr-4 rounded-sm"
          />{" "}
          Indic
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/JP - Japan.svg"
            alt="Japan"
            width={30}
            height={30}
            className="mr-4 rounded-sm"
          />{" "}
          Japanese
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/CN - China.svg"
            alt="China"
            width={30}
            height={30}
            className="mr-4 rounded-sm"
          />{" "}
          Chinese
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/ES - Spain.svg"
            alt="Spain"
            width={30}
            height={30}
            className="mr-4 rounded-sm"
          />{" "}
          Espanol
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/FR - France.svg"
            alt="France"
            width={30}
            height={30}
            className="mr-4 rounded-sm"
          />{" "}
          French
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/KR - Korea (South).svg"
            alt="Korea (South)"
            width={30}
            height={30}
            className="mr-4 rounded-sm"
          />{" "}
          Korean
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/RU - Russian Federation.svg"
            alt="Russian Federation"
            width={30}
            height={30}
            className="mr-4 rounded-sm"
          />{" "}
          Russian
        </Button>
        {/* <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/SA - Saudi Arabia.svg"
            alt="Saudi Arabia"
            width={30}
            height={30}
            className="mr-4 rounded-sm"
          />{" "}
          Arabian
        </Button> */}
      </div>
    </footer>
  );
};
