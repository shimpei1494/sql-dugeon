import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";

import type { Lesson } from "../lessons/types";
import { seedDatabase } from "./seedDatabase";

type SqlJsDatabase = initSqlJs.Database;

let sqlJsPromise: Promise<initSqlJs.SqlJsStatic> | undefined;

function getSqlJs() {
  sqlJsPromise ??= initSqlJs({
    locateFile: () => wasmUrl,
  });

  return sqlJsPromise;
}

export async function createLessonDatabase(lesson: Lesson): Promise<SqlJsDatabase> {
  const SQL = await getSqlJs();
  const db = new SQL.Database();

  seedDatabase(db, lesson.schema);

  return db;
}
