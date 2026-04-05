import { Stack } from "@mantine/core";
import { getPostsPath } from "@/shared/lib/routes";
import { EmptyState } from "@/shared/ui";

export default function NotFoundPage() {
  return (
    <Stack py="xl">
      <EmptyState
        actionHref={getPostsPath()}
        actionLabel="Go to the archive"
        description="The route does not match any page in this static blog."
        title="Page not found"
      />
    </Stack>
  );
}
