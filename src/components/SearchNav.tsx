import { TextInput, Group, ActionIcon } from '@mantine/core';
import { IconHeart, IconShoppingCart, IconUser } from '@tabler/icons-react';

interface SearchNavProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SearchNav({ searchQuery, onSearchChange }: SearchNavProps) {
  return (
    <Group justify="space-between">
      <TextInput
        placeholder="Search for shoes..."
        value={searchQuery}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        size="md"
        w={400}
      />
      <Group>
        <ActionIcon variant="subtle" size="lg">
          <IconHeart />
        </ActionIcon>
        <ActionIcon variant="subtle" size="lg">
          <IconShoppingCart />
        </ActionIcon>
        <ActionIcon variant="subtle" size="lg">
          <IconUser />
        </ActionIcon>
      </Group>
    </Group>
  );
}