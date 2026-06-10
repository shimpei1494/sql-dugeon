import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";

import type { Lesson, SqlValue, TableDefinition } from "../lessons/types";
import { buildTableDdl, quoteIdentifier } from "./tableDdl";

type SqlJsDatabase = initSqlJs.Database;
type SqlJsValue = initSqlJs.SqlValue;

let sqlJsPromise: Promise<initSqlJs.SqlJsStatic> | undefined;

function getSqlJs() {
  sqlJsPromise ??= initSqlJs({
    locateFile: () => wasmUrl,
  });

  return sqlJsPromise;
}

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

export async function createLessonDatabase(lesson: Lesson): Promise<SqlJsDatabase> {
  const SQL = await getSqlJs();
  const db = new SQL.Database();

  for (const table of lesson.schema) {
    db.run(buildTableDdl(table));
    insertRows(db, table);
  }

  return db;
}
