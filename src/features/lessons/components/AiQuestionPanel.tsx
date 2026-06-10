import {
  Button,
  Code,
  Collapse,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { useState } from "react";

import type { SqlExecutionResult } from "../../sqlite/sqliteTypes";
import type { Lesson } from "../types";
import type { AiQuestionPurpose } from "../utils/buildAiQuestionContext";
import { aiQuestionPurposes, buildAiQuestionContext } from "../utils/buildAiQuestionContext";
import type { LessonGradingResult } from "../utils/gradeLessonAttempt";

type AiQuestionPanelProps = {
  lesson: Lesson;
  sql: string;
  executionResult?: SqlExecutionResult;
  gradingResult?: LessonGradingResult;
};

export function AiQuestionPanel({
  lesson,
  sql,
  executionResult,
  gradingResult,
}: AiQuestionPanelProps) {
  const [purpose, setPurpose] = useState<AiQuestionPurpose>("hint");
  const [isPreviewOpen, { toggle: togglePreview }] = useDisclosure(false);
  const clipboard = useClipboard({ timeout: 2000 });

  const context = buildAiQuestionContext({
    lesson,
    purpose,
    sql,
    executionResult,
    gradingResult,
  });

  return (
    <Paper withBorder p="lg" radius="md">
      <Stack gap="md">
        <Stack gap={4}>
          <Title order={2} size="h3">
            AI に質問する
          </Title>
          <Text size="sm" c="dimmed">
            この Lesson の課題・テーブル定義・あなたの SQL・実行状況をまとめてコピーできます。
            Claude や ChatGPT などの AI に貼り付けると、文脈を伝えた状態で質問できます。
          </Text>
        </Stack>

        <SegmentedControl
          value={purpose}
          onChange={(value) => setPurpose(value as AiQuestionPurpose)}
          data={aiQuestionPurposes.map(({ value, label }) => ({ value, label }))}
        />

        <Group>
          <Button
            onClick={() => clipboard.copy(context)}
            color={clipboard.copied ? "teal" : undefined}
          >
            {clipboard.copied ? "コピーしました" : "質問用コンテキストをコピー"}
          </Button>
          <Button variant="subtle" onClick={togglePreview}>
            {isPreviewOpen ? "内容を隠す" : "コピーされる内容を確認"}
          </Button>
        </Group>

        <Collapse expanded={isPreviewOpen}>
          <Code block className="ai-question-context">
            {context}
          </Code>
        </Collapse>
      </Stack>
    </Paper>
  );
}
