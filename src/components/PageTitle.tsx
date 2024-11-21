import { PropsWithChildren } from "react";

export const PageTitle = (props: PropsWithChildren) => (
  <h2 className="border-b mb-4 pb-2 font-semibold text-2xl">
    {props.children}
  </h2>
);
