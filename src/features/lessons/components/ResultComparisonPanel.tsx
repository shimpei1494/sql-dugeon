import { Alert, Badge, Button, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";

import type { SqlExecutionResult } from "../../sqlite/sqliteTypes";
import type { Lesson, LessonSummary } from "../types";
import type { LessonGradingResult } from "../utils/gradeLessonAttempt";
import { DataTable } from "./DataTable";

type ResultComparisonPanelProps = {
  compareMode: Lesson["compareMode"];
  expectedResult: Lesson["expectedResult"];
  executionResult?: SqlExecutionResult;
  gradingResult?: LessonGradingResult;
  isCompleted: boolean;
  nextLesson?: LessonSummary;
};

function getCompareModeLabel(compareMode: Lesson["compareMode"]) {
  switch (compareMode) {
    case "ordered":
      return "行の順序も採点します";
    case "unordered":
      return "行の順序は問いません";
  }
}

function GradingStatus({
  executionResult,
  gradingResult,
  isCompleted,
}: Pick<ResultComparisonPanelProps, "executionResult" | "gradingResult" | "isCompleted">) {
  if (executionResult && !executionResult.ok) {
    return (
      <Alert color="red" title="SQL を実行できませんでした">
        {executionResult.message}
      </Alert>
    );
  }

  if (gradingResult) {
    if (gradingResult.ok) {
      return (
        <Alert color="teal" title="正解です">
          Lesson の完了状態を保存しました。
        </Alert>
      );
    }

    const isConstructIssue = gradingResult.kind === "construct";

    return (
      <Alert
        color={isConstructIssue ? "yellow" : "orange"}
        title={isConstructIssue ? "構文を確認しましょう" : "まだ正解ではありません"}
      >
        <Stack gap={4}>
          <Text size="sm">{gradingResult.message}</Text>
          {gradingResult.rowDiff ? (
            <Text size="sm" c="dimmed">
              下の表で色が付いている行が、期待結果と一致しない行です。
            </Text>
          ) : null}
        </Stack>
      </Alert>
    );
  }

  if (isCompleted) {
    return (
      <Alert color="teal" title="完了済み">
        この Lesson は完了済みです。
      </Alert>
    );
  }

  return (
    <Text size="sm" c="dimmed">
      SQL を実行すると、期待する出力と並べて比較し採点します。
    </Text>
  );
}

function ActualResultContent({
  executionResult,
  rowFlags,
}: {
  executionResult?: SqlExecutionResult;
  rowFlags?: boolean[];
}) {
  if (!executionResult) {
    return (
      <Text size="sm" c="dimmed">
        SQL を実行すると結果がここに表示されます。
      </Text>
    );
  }

  if (!executionResult.ok) {
    return (
      <Text size="sm" c="dimmed">
        実行エラーのため結果はありません。上のエラーメッセージを確認してください。
      </Text>
    );
  }

  if (executionResult.result.columns.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        結果セットはありません。
      </Text>
    );
  }

  return (
    <DataTable table={executionResult.result} emptyLabel="結果は 0 件です。" rowFlags={rowFlags} />
  );
}

export function ResultComparisonPanel({
  compareMode,
  expectedResult,
  executionResult,
  gradingResult,
  isCompleted,
  nextLesson,
}: ResultComparisonPanelProps) {
  const isSolved = isCompleted || gradingResult?.ok === true;
  const rowDiff = gradingResult && !gradingResult.ok ? gradingResult.rowDiff : undefined;

  return (
    <Paper withBorder p="lg" radius="md">
      <Stack gap="md">
        <Title order={2} size="h3">
          実行結果と採点
        </Title>

        <GradingStatus
          executionResult={executionResult}
          gradingResult={gradingResult}
          isCompleted={isCompleted}
        />

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Title order={3} size="h4">
                期待する出力
              </Title>
              <Badge color={compareMode === "ordered" ? "blue" : "gray"} variant="light">
                {getCompareModeLabel(compareMode)}
              </Badge>
            </Group>
            <DataTable
              table={expectedResult}
              emptyLabel="期待する出力は 0 件です。"
              rowFlags={rowDiff?.expectedRowFlags}
            />
          </Stack>
          <Stack gap="sm">
            <Title order={3} size="h4">
              実行結果
            </Title>
            <ActualResultContent
              executionResult={executionResult}
              rowFlags={rowDiff?.actualRowFlags}
            />
          </Stack>
        </SimpleGrid>

        {isSolved ? (
          <Group>
            {nextLesson ? (
              <Button
                renderRoot={(rootProps) => (
                  <Link
                    to="/lessons/$lessonId"
                    params={{ lessonId: nextLesson.id }}
                    {...rootProps}
                  />
                )}
              >
                次の Lesson へ
              </Button>
            ) : null}
            <Button component={Link} to="/lessons" variant={nextLesson ? "default" : "filled"}>
              一覧へ戻る
            </Button>
          </Group>
        ) : null}
      </Stack>
    </Paper>
  );
}
