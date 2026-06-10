import type initSqlJs from "sql.js";

import type { SqlValue, TableDefinition } from "../lessons/types";
import { buildTableDdl, quoteIdentifier } from "./tableDdl";

type SqlJsDatabase = initSqlJs.Database;
type SqlJsValue = initSqlJs.SqlValue;

function toSqlJsValue(value: SqlValue): SqlJsValue {
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  return value;
}

function insertRows(db: SqlJsDatabase, table: TableDefinition) {
  if (table.rows.length === 0) {
    return;
  }

  const columnNames = table.columns.map((column) => column.name);
  const placeholders = columnNames.map(() => "?").join(", ");
  const sql = `INSERT INTO ${quoteIdentifier(table.name)} (${columnNames.map(quoteIdentifier).join(", ")}) VALUES (${placeholders});`;

  for (const row of table.rows) {
    db.run(
      sql,
      columnNames.map((columnName) => toSqlJsValue(row[columnName] ?? null)),
    );
  }
}

export function seedDatabase(db: SqlJsDatabase, tables: TableDefinition[]) {
  for (const table of tables) {
    db.run(buildTableDdl(table));
    insertRows(db, table);
  }
}
