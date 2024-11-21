import Image from "next/image";
import { PropsWithChildren } from "react";

import { SidebarNav } from "./SidebarNav";

export const AppLayout = (props: PropsWithChildren): JSX.Element => (
  <div className="flex h-screen bg-gray-100">
    <SidebarNav />

    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 shadow">
        <div className="flex flex-1 flex-col">
          <div className="self-end">
            <Image
              alt="ShelfCycle logomark"
              className="object-contain"
              height={50}
              width={50}
              src="/img/shelfcycle-logo-duo.png"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 p-6 text-gray-800 overflow-y-auto">
        <div className="container mx-auto">{props.children}</div>
      </div>
    </div>
  </div>
);
