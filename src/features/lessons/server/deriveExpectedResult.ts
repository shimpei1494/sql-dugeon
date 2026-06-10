import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

import initSqlJs from "sql.js";

import { toQueryResult } from "../../sqlite/queryResultConversion";
import { seedDatabase } from "../../sqlite/seedDatabase";
import type { LessonDefinition, QueryResult, TableDefinition } from "../types";

let sqlJsPromise: Promise<initSqlJs.SqlJsStatic> | undefined;

function getServerSqlJs() {
  // サーバー（Node）では wasm をファイルとして直接読み込む。
  // emscripten は ArrayBuffer を要求するため、Buffer から独立した ArrayBuffer へコピーする。
  sqlJsPromise ??= initSqlJs({
    wasmBinary: new Uint8Array(
      readFileSync(createRequire(import.meta.url).resolve("sql.js/dist/sql-wasm.wasm")),
    ).buffer,
  });

  return sqlJsPromise;
}

/** Lesson のスキーマで初期化した DB 上で任意の SQL を実行する（テスト・期待結果導出用）。 */
export async function executeDefinitionSql(
  schema: TableDefinition[],
  sql: string,
): Promise<QueryResult> {
  const SQL = await getServerSqlJs();
  const db = new SQL.Database();

  try {
    seedDatabase(db, schema);
    return toQueryResult(db.exec(sql).at(-1));
  } finally {
    db.close();
  }
}

/**
 * solutionSql を Lesson のスキーマ上で実行し、期待結果を導出する。
 * 教材作成時に期待結果を手書きで再現する必要をなくし、模範解答との不整合を防ぐ。
 */
export async function deriveExpectedResult(definition: LessonDefinition): Promise<QueryResult> {
  const result = await executeDefinitionSql(definition.schema, definition.solutionSql);

  if (result.columns.length === 0) {
    throw new Error(`Lesson "${definition.id}" の solutionSql が結果セットを返しませんでした。`);
  }

  return result;
}
