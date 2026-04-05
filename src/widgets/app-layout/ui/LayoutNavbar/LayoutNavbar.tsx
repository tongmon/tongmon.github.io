import { Flex, Image, ScrollArea, Text } from "@mantine/core";
import useNavbarContent from "../../model/useNavbarContent";
import NavbarLinksGroup from "../NavbarLinksGroup/NavbarLinksGroup";
import { IconStackPush, IconTag } from "@tabler/icons-react";

interface LayoutNavbarProps {
  onNavigate?: () => void;
}

export default function LayoutNavbar({ onNavigate }: LayoutNavbarProps) {
  const { navbarContent } = useNavbarContent();

  return (
    <Flex
      component="nav"
      w="100%"
      h="100%"
      direction="column"
      justify="flex-start"
      align="flex-start"
      bg="var(--navbar-color)"
      p="md"
    >
      <Flex
        justify="flex-start"
        align="center"
        w="100%"
        // h="var(--header-height)"
        h="clamp(16px, 4dvh, 48px)"
        mb={{ base: "md", md: "lg" }}
      >
        <IconTag size={20} />
        <Text ml="xs" size="sm" fw={600}>
          Tags
        </Text>
      </Flex>

      <ScrollArea w="100%" flex="1 1 0">
        <Flex
          direction="column"
          justify="flex-start"
          align="stretch"
          flex="1 1 0"
        >
          {navbarContent.map((item) => (
            <NavbarLinksGroup
              navbarItem={item}
              onNavigate={onNavigate}
              key={item.id}
            />
          ))}
        </Flex>
      </ScrollArea>
    </Flex>
  );
}
