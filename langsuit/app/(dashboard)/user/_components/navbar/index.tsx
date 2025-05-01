import { Logo } from "./logo";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full h-20 z-[49] bg-[#252731] px-2 flex justify-center items-center shadow-sm">
      <Logo />
    </nav>
  );
};
