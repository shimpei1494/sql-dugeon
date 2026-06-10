import { Alert, Button, Group, Stack, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";

import type { SqlExecutionResult } from "../../sqlite/sqliteTypes";
import type { LessonSummary } from "../types";
import type { LessonGradingResult } from "../utils/gradeLessonAttempt";

type RunStatusBannerProps = {
  executionResult?: SqlExecutionResult;
  gradingResult?: LessonGradingResult;
  nextLesson?: LessonSummary;
  onShowDetails: () => void;
};

/** SQL 実行直後に、スクロールせずに結果がわかるコンパクトなステータス表示。 */
export function RunStatusBanner({
  executionResult,
  gradingResult,
  nextLesson,
  onShowDetails,
}: RunStatusBannerProps) {
  if (!executionResult) {
    return null;
  }

  if (!executionResult.ok) {
    return (
      <Alert color="red" title="SQL を実行できませんでした">
        <Text size="sm">{executionResult.message}</Text>
      </Alert>
    );
  }

  if (gradingResult?.ok) {
    return (
      <Alert color="teal" title="正解です 🎉">
        <Group gap="sm" mt={4}>
          {nextLesson ? (
            <Button
              size="xs"
              color="teal"
              renderRoot={(rootProps) => (
                <Link to="/lessons/$lessonId" params={{ lessonId: nextLesson.id }} {...rootProps} />
              )}
            >
              次の Lesson へ
            </Button>
          ) : null}
          <Button size="xs" variant="light" color="teal" onClick={onShowDetails}>
            結果と解説を確認 ↓
          </Button>
        </Group>
      </Alert>
    );
  }

  if (gradingResult) {
    const isConstructIssue = gradingResult.kind === "construct";

    return (
      <Alert
        color={isConstructIssue ? "yellow" : "orange"}
        title={isConstructIssue ? "構文を確認しましょう" : "まだ正解ではありません"}
      >
        <Stack gap={6} align="flex-start">
          <Text size="sm">{gradingResult.message}</Text>
          {gradingResult.rowDiff ? (
            <Button
              size="xs"
              variant="light"
              color={isConstructIssue ? "yellow" : "orange"}
              onClick={onShowDetails}
            >
              下の表で差分を確認 ↓
            </Button>
          ) : null}
        </Stack>
      </Alert>
    );
  }

  return null;
}
