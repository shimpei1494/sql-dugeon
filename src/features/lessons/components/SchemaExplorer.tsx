import { Badge, Group, Stack, Tabs, Text } from "@mantine/core";

import type { TableDefinition } from "../types";
import { DataTable } from "./DataTable";

type SchemaExplorerProps = {
  tables: TableDefinition[];
};

export function SchemaExplorer({ tables }: SchemaExplorerProps) {
  const firstTable = tables[0]?.name;

  if (!firstTable) {
    return (
      <Text size="sm" c="dimmed">
        表示できるテーブルがありません。
      </Text>
    );
  }

  return (
    <Tabs defaultValue={firstTable}>
      <Tabs.List>
        {tables.map((table) => (
          <Tabs.Tab key={table.name} value={table.name}>
            {table.name}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {tables.map((table) => (
        <Tabs.Panel key={table.name} value={table.name} pt="md">
          <Stack gap="md">
            <Group gap="xs">
              {table.columns.map((column) => (
                <Badge key={column.name} variant="light" color="gray" radius="sm">
                  {column.name}: {column.type}
                </Badge>
              ))}
            </Group>
            <DataTable table={table} />
          </Stack>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
