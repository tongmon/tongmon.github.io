import { Button, OverflowList } from "@mantine/core";
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
        renderOverflow={(items) => (
          <Button disabled radius="xl" size="compact-xs" variant="subtle">
            +{items.length} more
          </Button>
        )}
        renderItem={(item, index) => (
          <Button
            aria-label={`View posts tagged ${item}`}
            component={Link}
            key={`${item}-${index}`}
            radius="xl"
            size="compact-xs"
            to={getTagPath(item)}
            variant="light"
          >
            {item}
          </Button>
        )}
      />
    </div>
  );
}
