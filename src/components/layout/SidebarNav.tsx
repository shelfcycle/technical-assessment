import { SidebarNavItem, SidebarNavItemProps } from "./SidebarNavItem";

const navItems: SidebarNavItemProps[] = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Customers",
    route: "/customers",
  },
];

export const SidebarNav = (): JSX.Element => (
  <div className="hidden md:flex flex-col w-64 bg-gray-200 dark:bg-gray-800">
    <div className="flex items-center justify-center h-16 bg-gray-500 dark:bg-gray-900">
      <span className="text-white font-bold uppercase">ShelfCycle</span>
    </div>
    <div className="flex flex-col flex-1 overflow-y-auto">
      <nav className="flex-1 px-2 py-4 bg-gray-400 dark:bg-gray-800">
        {navItems.map((x, i) => (
          <SidebarNavItem key={`navItem_${i}`} {...x} />
        ))}
      </nav>
    </div>
  </div>
);
