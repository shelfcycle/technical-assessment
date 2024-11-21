import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarNavItemProps {
  label: string;
  route: string;
}
export const SidebarNavItem = (props: SidebarNavItemProps): JSX.Element => {
  const pathname = usePathname();
  const isActive =
    props.route === "/" // Special case for root
      ? pathname === props.route
      : pathname.startsWith(props.route) ||
        pathname.startsWith(`${props.route}/`);
  let className =
    "flex items-center px-4 py-2 my-1 text-gray-100 hover:bg-gray-700 rounded-lg";
  if (isActive) {
    className += " bg-gray-700";
  }

  return (
    <Link className={className} href={props.route}>
      {props.label}
    </Link>
  );
};
