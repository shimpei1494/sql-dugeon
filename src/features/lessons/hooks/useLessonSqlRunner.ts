import { useEffect, useState } from "react";

import { executeLessonSql } from "../../sqlite/executeSql";
import type { SqlExecutionResult } from "../../sqlite/sqliteTypes";
import type { Lesson } from "../types";
import { gradeLessonAttempt } from "../utils/gradeLessonAttempt";
import type { LessonGradingResult } from "../utils/gradeLessonAttempt";
import { clearLessonDraft, readLessonDraft, writeLessonDraft } from "./lessonDraftStorage";
import { markLessonCompleted } from "./useCompletedLessons";

export function useLessonSqlRunner(lesson: Lesson) {
  const [sql, setSqlState] = useState(lesson.starterSql);
  const [executionResult, setExecutionResult] = useState<SqlExecutionResult | undefined>();
  const [gradingResult, setGradingResult] = useState<LessonGradingResult | undefined>();
  const [isRunning, setIsRunning] = useState(false);

  // 下書きは localStorage 由来のため、hydration 後に復元する。
  useEffect(() => {
    const draft = readLessonDraft(lesson.id);

    if (draft !== undefined) {
      setSqlState(draft);
    }
  }, [lesson.id]);

  function setSql(value: string) {
    setSqlState(value);

    if (value === lesson.starterSql) {
      clearLessonDraft(lesson.id);
    } else {
      writeLessonDraft(lesson.id, value);
    }
  }

  async function runSql() {
    setIsRunning(true);

    try {
      const result = await executeLessonSql(lesson, sql);
      setExecutionResult(result);

      if (result.ok) {
        const grading = gradeLessonAttempt(lesson, sql, result.result);
        setGradingResult(grading);

        if (grading.ok) {
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
    setSqlState(lesson.starterSql);
    clearLessonDraft(lesson.id);
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
