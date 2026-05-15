import { Stack, Text, Title } from "@mantine/core";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <Stack gap={6}>
      {eyebrow ? (
        <Text tt="uppercase" size="xs" fw={700} c="teal.7">
          {eyebrow}
        </Text>
      ) : null}
      <Title order={1}>{title}</Title>
      <Text c="dimmed" maw={720}>
        {description}
      </Text>
    </Stack>
  );
}
