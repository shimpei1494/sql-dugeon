import {
  Badge,
  Button,
  Code,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { markLessonOpened, useCompletedLessons } from "../hooks/useCompletedLessons";
import { useLessonSqlRunner } from "../hooks/useLessonSqlRunner";
import type { LessonPayload } from "../types";
import { AiQuestionPanel } from "./AiQuestionPanel";
import { LessonSupportPanel } from "./LessonSupportPanel";
import { ResultComparisonPanel } from "./ResultComparisonPanel";
import { RunStatusBanner } from "./RunStatusBanner";
import { SchemaExplorer } from "./SchemaExplorer";
import { SqlEditor } from "./SqlEditor";

type LessonWorkspaceProps = {
  payload: LessonPayload;
};

const resultPanelId = "result-comparison-panel";

function scrollToResultPanel() {
  document.getElementById(resultPanelId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LessonWorkspace({ payload }: LessonWorkspaceProps) {
  const { lesson, nextLesson, seedVersion } = payload;
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
        <Stack gap="md">
          <Stack gap="xs">
            <Title order={2} size="h3">
              課題
            </Title>
            <Text>{lesson.task}</Text>
          </Stack>
          <Divider />
          <Stack gap="xs">
            <Title order={3} size="h4">
              このレッスンで学ぶ構文
            </Title>
            <Code block className="solution-code">
              {lesson.learningPoint.syntax}
            </Code>
            <Text size="sm" c="dimmed">
              {lesson.learningPoint.description}
            </Text>
          </Stack>
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
              tables={lesson.schema}
            />
            <RunStatusBanner
              executionResult={executionResult}
              gradingResult={gradingResult}
              nextLesson={nextLesson}
              onShowDetails={scrollToResultPanel}
            />
          </Stack>
        </Paper>
      </SimpleGrid>

      <div id={resultPanelId} className="result-panel-anchor">
        <ResultComparisonPanel
          compareMode={lesson.compareMode}
          expectedResult={lesson.expectedResult}
          executionResult={executionResult}
          gradingResult={gradingResult}
          isCompleted={isCompleted}
          nextLesson={nextLesson}
        />
      </div>

      <LessonSupportPanel
        key={lesson.id}
        explanation={lesson.explanation}
        hints={lesson.hints}
        isReviewAvailable={isCompleted || gradingResult?.ok === true}
        solutionSql={lesson.solutionSql}
      />

      <AiQuestionPanel
        lesson={lesson}
        sql={sql}
        executionResult={executionResult}
        gradingResult={gradingResult}
      />
    </Stack>
  );
}
