import { Alert, Paper, Stack, Text, Title } from "@mantine/core";

import type { SqlExecutionResult } from "../../sqlite/sqliteTypes";
import { DataTable } from "./DataTable";

type QueryResultPanelProps = {
  executionResult?: SqlExecutionResult;
};

export function QueryResultPanel({ executionResult }: QueryResultPanelProps) {
  return (
    <Paper withBorder p="lg" radius="md">
      <Stack gap="md">
        <Title order={2} size="h3">
          実行結果
        </Title>
        {!executionResult ? (
          <Text size="sm" c="dimmed">
            SQL を実行すると結果がここに表示されます。
          </Text>
        ) : executionResult.ok ? (
          executionResult.result.columns.length > 0 ? (
            <DataTable table={executionResult.result} emptyLabel="結果は 0 件です。" />
          ) : (
            <Text size="sm" c="dimmed">
              結果セットはありません。
            </Text>
          )
        ) : (
          <Alert color="red" title="SQL を実行できませんでした">
            {executionResult.message}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
