import { Box, Table, Text } from "@mantine/core";

import type { QueryResult, SqlValue, TableDefinition } from "../types";

type DataTableProps = {
  table: TableDefinition | QueryResult;
  emptyLabel?: string;
  /** true の位置の行を「期待結果と一致しない行」としてハイライトします。 */
  rowFlags?: boolean[];
};

function formatValue(value: SqlValue): string {
  if (value === null) {
    return "NULL";
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  return String(value);
}

export function DataTable({ table, emptyLabel = "データがありません", rowFlags }: DataTableProps) {
  const columns =
    "columns" in table
      ? table.columns.map((column) => (typeof column === "string" ? column : column.name))
      : [];
  const rows = table.rows;

  if (rows.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        {emptyLabel}
      </Text>
    );
  }

  return (
    <Box className="table-scroll">
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th key={column}>{column}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row, rowIndex) => {
            const rowKey = `${rowIndex}:${columns.map((column) => formatValue(row[column] ?? null)).join("|")}`;
            const isFlagged = rowFlags?.[rowIndex] === true;

            return (
              <Table.Tr key={rowKey} className={isFlagged ? "diff-row" : undefined}>
                {columns.map((column) => (
                  <Table.Td key={column}>{formatValue(row[column] ?? null)}</Table.Td>
                ))}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
