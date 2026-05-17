import { useState } from "react";

import { compareQueryResults } from "../../sqlite/compareQueryResults";
import type { QueryResultComparison } from "../../sqlite/compareQueryResults";
import { executeLessonSql } from "../../sqlite/executeSql";
import type { SqlExecutionResult } from "../../sqlite/sqliteTypes";
import type { Lesson } from "../types";
import { markLessonCompleted } from "./useCompletedLessons";

export function useLessonSqlRunner(lesson: Lesson) {
  const [sql, setSql] = useState(lesson.starterSql);
  const [executionResult, setExecutionResult] = useState<SqlExecutionResult | undefined>();
  const [gradingResult, setGradingResult] = useState<QueryResultComparison | undefined>();
  const [isRunning, setIsRunning] = useState(false);

  async function runSql() {
    setIsRunning(true);

    try {
      const result = await executeLessonSql(lesson, sql);
      setExecutionResult(result);

      if (result.ok) {
        const comparison = compareQueryResults(
          lesson.expectedResult,
          result.result,
          lesson.compareMode,
        );
        setGradingResult(comparison);

        if (comparison.ok) {
          markLessonCompleted(lesson.id);
        }
      } else {
        setGradingResult(undefined);
      }
    } finally {
      setIsRunning(false);
    }
  }

  function resetSql() {
    setSql(lesson.starterSql);
    setExecutionResult(undefined);
    setGradingResult(undefined);
  }

  return {
    executionResult,
    gradingResult,
    isRunning,
    resetSql,
    runSql,
    setSql,
    sql,
  };
}
