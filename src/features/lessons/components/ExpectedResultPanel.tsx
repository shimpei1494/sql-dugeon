import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";

import type { Lesson } from "../types";
import { DataTable } from "./DataTable";

type ExpectedResultPanelProps = {
  compareMode: Lesson["compareMode"];
  expectedResult: Lesson["expectedResult"];
};

function getCompareModeLabel(compareMode: Lesson["compareMode"]) {
  switch (compareMode) {
    case "ordered":
      return "行の順序も採点します";
    case "unordered":
      return "行の順序は問いません";
  }
}

export function ExpectedResultPanel({ compareMode, expectedResult }: ExpectedResultPanelProps) {
  return (
    <Paper withBorder p="lg" radius="md">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} size="h3">
              期待する出力
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              SQL の実行結果がこの表と一致すると正解です。
            </Text>
          </div>
          <Badge color={compareMode === "ordered" ? "blue" : "gray"} variant="light">
            {getCompareModeLabel(compareMode)}
          </Badge>
        </Group>
        <DataTable table={expectedResult} emptyLabel="期待する出力は 0 件です。" />
      </Stack>
    </Paper>
  );
}
