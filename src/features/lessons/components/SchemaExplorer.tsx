import { Badge, Code, Group, SegmentedControl, Stack, Tabs, Text } from "@mantine/core";
import { useState } from "react";

import { buildTableDdl } from "../../sqlite/tableDdl";
import type { TableDefinition } from "../types";
import { DataTable } from "./DataTable";

type SchemaExplorerProps = {
  tables: TableDefinition[];
};

type SchemaView = "data" | "ddl";

export function SchemaExplorer({ tables }: SchemaExplorerProps) {
  const [view, setView] = useState<SchemaView>("data");
  const firstTable = tables[0]?.name;

  if (!firstTable) {
    return (
      <Text size="sm" c="dimmed">
        表示できるテーブルがありません。
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      <SegmentedControl
        value={view}
        onChange={(value) => setView(value as SchemaView)}
        size="xs"
        w="fit-content"
        data={[
          { value: "data", label: "カラムとデータ" },
          { value: "ddl", label: "CREATE TABLE 文" },
        ]}
      />

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
            {view === "ddl" ? (
              <Code block className="solution-code">
                {buildTableDdl(table)}
              </Code>
            ) : (
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
            )}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  );
}
