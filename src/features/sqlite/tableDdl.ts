import type { TableDefinition } from "../lessons/types";

export function quoteIdentifier(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

export function buildTableDdl(table: TableDefinition): string {
  const columns = table.columns.map((column) => {
    const nullable = column.nullable === false ? " NOT NULL" : "";
    return `  ${quoteIdentifier(column.name)} ${column.type}${nullable}`;
  });

  return `CREATE TABLE ${quoteIdentifier(table.name)} (\n${columns.join(",\n")}\n);`;
}
