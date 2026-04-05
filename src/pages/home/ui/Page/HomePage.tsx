import { Flex, Text } from "@mantine/core";

export default function HomePage() {
  return (
    <Flex
      direction="column"
      gap="sm"
      mih="100%"
      w="100%"
      p={{ base: "sm", sm: "md" }}
    >
      <Text size="xl">Hello World!</Text>
    </Flex>
  );
}
