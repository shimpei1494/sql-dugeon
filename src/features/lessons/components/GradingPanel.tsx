import { Alert, Button, Group, Paper, Stack, Text, Title } from "@mantine/core";

import type { QueryResultComparison } from "../../sqlite/compareQueryResults";
import type { LessonSummary } from "../types";

type GradingPanelProps = {
  gradingResult?: QueryResultComparison;
  isCompleted: boolean;
  nextLesson?: LessonSummary;
};

export function GradingPanel({ gradingResult, isCompleted, nextLesson }: GradingPanelProps) {
  const isSolved = isCompleted || gradingResult?.ok === true;

  return (
    <Paper withBorder p="lg" radius="md">
      <Stack gap="md">
        <Title order={2} size="h3">
          採点
        </Title>
        {gradingResult ? (
          gradingResult.ok ? (
            <Alert color="teal" title="正解です">
              Lesson の完了状態を保存しました。
            </Alert>
          ) : (
            <Alert color="orange" title="まだ正解ではありません">
              {gradingResult.message}
            </Alert>
          )
        ) : isCompleted ? (
          <Alert color="teal" title="完了済み">
            この Lesson は完了済みです。
          </Alert>
        ) : (
          <Text size="sm" c="dimmed">
            SQL を実行すると期待結果と比較して採点します。
          </Text>
        )}
        {isSolved ? (
          <Group>
            {nextLesson ? (
              <Button component="a" href={`/lessons/${nextLesson.id}`}>
                次の Lesson へ
              </Button>
            ) : null}
            <Button component="a" href="/lessons" variant={nextLesson ? "default" : "filled"}>
              一覧へ戻る
            </Button>
          </Group>
        ) : null}
      </Stack>
    </Paper>
  );
}
