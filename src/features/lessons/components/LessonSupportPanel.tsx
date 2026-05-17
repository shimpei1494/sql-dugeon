import { Button, Code, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";

type LessonSupportPanelProps = {
  explanation: string;
  hints: string[];
  isReviewAvailable: boolean;
  solutionSql: string;
};

export function LessonSupportPanel({
  explanation,
  hints,
  isReviewAvailable,
  solutionSql,
}: LessonSupportPanelProps) {
  const [visibleHintCount, setVisibleHintCount] = useState(0);
  const [isSolutionVisible, setIsSolutionVisible] = useState(false);
  const visibleHints = hints.slice(0, visibleHintCount);
  const hasMoreHints = visibleHintCount < hints.length;
  const shouldShowReview = isReviewAvailable || isSolutionVisible;

  return (
    <Paper withBorder p="lg" radius="md">
      <Stack gap="lg">
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Title order={2} size="h3">
              ヒント
            </Title>
            {hasMoreHints ? (
              <Button
                variant="default"
                size="xs"
                onClick={() => setVisibleHintCount((count) => count + 1)}
              >
                ヒントを表示
              </Button>
            ) : null}
          </Group>
          {visibleHints.length > 0 ? (
            visibleHints.map((hint, index) => (
              <Text key={hint} size="sm" c="dimmed">
                {index + 1}. {hint}
              </Text>
            ))
          ) : (
            <Text size="sm" c="dimmed">
              必要になったらヒントを 1 つずつ確認できます。
            </Text>
          )}
        </Stack>

        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Title order={2} size="h3">
              解説
            </Title>
            {!shouldShowReview ? (
              <Button variant="subtle" size="xs" onClick={() => setIsSolutionVisible(true)}>
                模範解答を表示
              </Button>
            ) : null}
          </Group>
          {shouldShowReview ? (
            <Stack gap="sm">
              <Code block className="solution-code">
                {solutionSql}
              </Code>
              <Text size="sm" c="dimmed">
                {explanation}
              </Text>
            </Stack>
          ) : (
            <Text size="sm" c="dimmed">
              正解後に解説が表示されます。先に確認したい場合は模範解答を表示できます。
            </Text>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
