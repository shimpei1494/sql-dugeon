import type { Lesson } from "../lessons/types";
import { createLessonDatabase } from "./createLessonDatabase";
import { toQueryResult } from "./queryResultConversion";
import type { SqlExecutionResult } from "./sqliteTypes";
import { validateExecutableSql } from "./sqlSafety";

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
