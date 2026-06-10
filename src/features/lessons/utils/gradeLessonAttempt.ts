import { compareQueryResults } from "../../sqlite/compareQueryResults";
import type { QueryRowDiff } from "../../sqlite/compareQueryResults";
import type { Lesson, QueryResult } from "../types";
import { findMissingConstructs } from "./sqlConstructs";

export type LessonGradingResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      /** construct: 課題が教えたい構文を使っていない / result: 実行結果が期待と一致しない */
      kind: "construct" | "result";
      message: string;
      rowDiff?: QueryRowDiff;
    };

/**
 * 実行結果の比較に加えて、課題が教えたい構文（requiredConstructs）を
 * 実際に使っているかを採点する。結果が偶然一致する別解（LIKE を = で代用など）を
 * 正解にせず、学習目標へ誘導するメッセージを返す。
 */
export function gradeLessonAttempt(
  lesson: Lesson,
  sql: string,
  actualResult: QueryResult,
): LessonGradingResult {
  const comparison = compareQueryResults(lesson.expectedResult, actualResult, lesson.compareMode);
  const firstMissingConstruct = findMissingConstructs(sql, lesson.requiredConstructs)[0];

  if (firstMissingConstruct) {
    return {
      ok: false,
      kind: "construct",
      message: comparison.ok
        ? `実行結果は期待どおりですが、${firstMissingConstruct.message}`
        : firstMissingConstruct.message,
      rowDiff: comparison.ok ? undefined : comparison.rowDiff,
    };
  }

  if (comparison.ok) {
    return { ok: true };
  }

  return {
    ok: false,
    kind: "result",
    message: comparison.message,
    rowDiff: comparison.rowDiff,
  };
}
