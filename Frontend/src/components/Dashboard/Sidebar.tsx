import { JSX } from "react";
import { Link } from "react-router";

type SidebarProps = {
  isOpen: boolean;
  children: JSX.Element[]
};

export default function Sidebar({ isOpen, children }: SidebarProps) {
  return (
    <div
      className={`
            p-2 flex flex-col gap-2
            fixed md:static
            h-screen
            w-64
            bg-background-muted
            dark:bg-background-dark
            dark:shadow-white/20
            z-40
            transition-all duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            shadow-lg shadow-black/20
        `}
    >
      <Link to="/">
        <h2 className="text-text dark:text-text-light text-4xl font-bold">
          Study
          <br />
          Mate
        </h2>
      </Link>
      {children}
    </div>
  );
}