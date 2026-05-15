import { Badge, Button, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import type { LessonPayload } from "../types";
import { SchemaExplorer } from "./SchemaExplorer";
import { SqlEditor } from "./SqlEditor";

type LessonWorkspaceProps = {
  payload: LessonPayload;
};

export function LessonWorkspace({ payload }: LessonWorkspaceProps) {
  const { lesson, seedVersion } = payload;
  const [sql, setSql] = useState(lesson.starterSql);

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="flex-start">
        <Stack gap={6}>
          <Group gap="xs">
            <Badge variant="light" color="teal">
              {lesson.difficulty}
            </Badge>
            <Badge variant="outline" color="gray">
              seed {seedVersion}
            </Badge>
          </Group>
          <Title order={1}>{lesson.title}</Title>
          <Text c="dimmed" maw={760}>
            {lesson.summary}
          </Text>
        </Stack>
        <Button component={Link} to="/lessons" variant="default">
          一覧へ戻る
        </Button>
      </Group>

      <Paper withBorder p="lg" radius="md">
        <Stack gap="xs">
          <Title order={2} size="h3">
            課題
          </Title>
          <Text>{lesson.task}</Text>
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <Paper withBorder p="lg" radius="md" h="100%">
          <Stack gap="md">
            <Title order={2} size="h3">
              スキーマと初期データ
            </Title>
            <SchemaExplorer tables={lesson.schema} />
          </Stack>
        </Paper>
        <Paper withBorder p="lg" radius="md" h="100%">
          <Stack gap="md">
            <Title order={2} size="h3">
              SQL
            </Title>
            <SqlEditor value={sql} onChange={setSql} onReset={() => setSql(lesson.starterSql)} />
          </Stack>
        </Paper>
      </SimpleGrid>

      <Paper withBorder p="lg" radius="md">
        <Stack gap="sm">
          <Title order={2} size="h3">
            ヒント
          </Title>
          {lesson.hints.map((hint) => (
            <Text key={hint} size="sm" c="dimmed">
              {hint}
            </Text>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
