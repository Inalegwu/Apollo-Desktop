import { ScrollArea } from "@radix-ui/themes";
import type React from "react";

type RenderItemProps<T> = {
  data: T;
  index: number;
};

type Props<T> = {
  data: T[];
  renderItem: (data: RenderItemProps<T>) => React.ReactNode;
  listHeaderComponent: () => React.ReactNode;
  listFooterComponent: () => React.ReactNode;
  scrollbars: "horizontal" | "vertical" | "both";
};

export default function Flatlist<T extends Record<string, unknown>>({
  data,
  listFooterComponent: ListFooterComponent,
  listHeaderComponent: ListHeaderComponent,
  renderItem,
  scrollbars,
}: Props<T>) {
  return (
    <ScrollArea scrollbars={scrollbars}>
      <ListHeaderComponent />
      {data.map((data, index) => renderItem({ data, index }))}
      <ListFooterComponent />
    </ScrollArea>
  );
}
