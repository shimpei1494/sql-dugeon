import { useState } from "react";

import { executeLessonSql } from "../../sqlite/executeSql";
import type { SqlExecutionResult } from "../../sqlite/sqliteTypes";
import type { Lesson } from "../types";

export function useLessonSqlRunner(lesson: Lesson) {
  const [sql, setSql] = useState(lesson.starterSql);
  const [executionResult, setExecutionResult] = useState<SqlExecutionResult | undefined>();
  const [isRunning, setIsRunning] = useState(false);

  async function runSql() {
    setIsRunning(true);

    try {
      const result = await executeLessonSql(lesson, sql);
      setExecutionResult(result);
    } finally {
      setIsRunning(false);
    }
  }

  function resetSql() {
    setSql(lesson.starterSql);
    setExecutionResult(undefined);
  }

  return {
    executionResult,
    isRunning,
    resetSql,
    runSql,
    setSql,
    sql,
  };
}
