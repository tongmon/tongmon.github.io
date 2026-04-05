import { Badge, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import { getTagPath } from "@/shared/lib/routes";

interface PostTagListProps {
  tags: string[];
}

export default function PostTagList({ tags }: PostTagListProps) {
  return (
    <Group gap="xs">
      {tags.map((tag) => (
        <Badge
          component={Link}
          key={tag}
          to={getTagPath(tag)}
          variant="light"
        >
          {tag}
        </Badge>
      ))}
    </Group>
  );
}
