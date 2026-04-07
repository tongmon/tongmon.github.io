import { Badge, Group, OverflowList } from "@mantine/core";
import { Link } from "react-router-dom";
import { getTagPath } from "@/shared/lib/routes";

interface PostTagListProps {
  tags: string[];
}

export default function PostTagList({ tags }: PostTagListProps) {
  return (
    <div style={{ overflow: "auto", maxWidth: "100%" }}>
      <OverflowList
        data={tags}
        gap="xs"
        renderOverflow={(items) => <Badge>+{items.length} more</Badge>}
        renderItem={(item, index) => <Badge key={index}>{item}</Badge>}
      />
    </div>
  );
}
