import { Badge, Button, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { markLessonOpened, useCompletedLessons } from "../hooks/useCompletedLessons";
import { useLessonSqlRunner } from "../hooks/useLessonSqlRunner";
import type { LessonPayload } from "../types";
import { ExpectedResultPanel } from "./ExpectedResultPanel";
import { GradingPanel } from "./GradingPanel";
import { LessonSupportPanel } from "./LessonSupportPanel";
import { QueryResultPanel } from "./QueryResultPanel";
import { SchemaExplorer } from "./SchemaExplorer";
import { SqlEditor } from "./SqlEditor";

type LessonWorkspaceProps = {
  payload: LessonPayload;
};

export function LessonWorkspace({ payload }: LessonWorkspaceProps) {
  const { lesson, seedVersion } = payload;
  const completedLessonIds = useCompletedLessons();
  const { executionResult, gradingResult, isRunning, resetSql, runSql, setSql, sql } =
    useLessonSqlRunner(lesson);
  const isCompleted = completedLessonIds.has(lesson.id);

  useEffect(() => {
    markLessonOpened(lesson.id);
  }, [lesson.id]);

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
            <SqlEditor
              value={sql}
              onChange={setSql}
              onReset={resetSql}
              onRun={runSql}
              isRunning={isRunning}
            />
          </Stack>
        </Paper>
      </SimpleGrid>

      <ExpectedResultPanel
        compareMode={lesson.compareMode}
        expectedResult={lesson.expectedResult}
      />
      <QueryResultPanel executionResult={executionResult} />
      <GradingPanel gradingResult={gradingResult} isCompleted={isCompleted} />

      <LessonSupportPanel
        key={lesson.id}
        explanation={lesson.explanation}
        hints={lesson.hints}
        isReviewAvailable={isCompleted || gradingResult?.ok === true}
        solutionSql={lesson.solutionSql}
      />
    </Stack>
  );
}
