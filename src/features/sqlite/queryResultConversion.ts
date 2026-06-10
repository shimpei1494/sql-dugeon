import type initSqlJs from "sql.js";

import type { QueryResult, SqlValue } from "../lessons/types";

type SqlJsValue = initSqlJs.SqlValue;

function toAppSqlValue(value: SqlJsValue): SqlValue {
  if (value instanceof Uint8Array) {
    return `[BLOB ${value.byteLength} bytes]`;
  }

  return value;
}

export function toQueryResult(result: initSqlJs.QueryExecResult | undefined): QueryResult {
  if (!result) {
    return {
      columns: [],
      rows: [],
    };
  }

  return {
    columns: result.columns,
    rows: result.values.map((values) =>
      Object.fromEntries(
        result.columns.map((column, index) => [column, toAppSqlValue(values[index] ?? null)]),
      ),
    ),
  };
}
