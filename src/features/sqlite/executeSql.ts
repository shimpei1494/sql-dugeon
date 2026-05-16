import type { Lesson, QueryResult, SqlValue } from "../lessons/types";
import { createLessonDatabase } from "./createLessonDatabase";
import type { SqlExecutionResult } from "./sqliteTypes";
import { validateExecutableSql } from "./sqlSafety";

type SqlJsValue = initSqlJs.SqlValue;

function toAppSqlValue(value: SqlJsValue): SqlValue {
  if (value instanceof Uint8Array) {
    return `[BLOB ${value.byteLength} bytes]`;
  }

  return value;
}

function toQueryResult(result: initSqlJs.QueryExecResult | undefined): QueryResult {
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

export async function executeLessonSql(lesson: Lesson, sql: string): Promise<SqlExecutionResult> {
  const safetyResult = validateExecutableSql(sql, lesson.allowedStatements);

  if (!safetyResult.ok) {
    return {
      ok: false,
      message: safetyResult.message,
    };
  }

  const db = await createLessonDatabase(lesson);

  try {
    const results = db.exec(safetyResult.normalizedSql);
    const result = toQueryResult(results.at(-1));

    return {
      ok: true,
      result,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "SQL の実行に失敗しました。",
    };
  } finally {
    db.close();
  }
}
