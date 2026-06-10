import * as v from "valibot";
import { describe, expect, it } from "vite-plus/test";

import { compareQueryResults } from "../../sqlite/compareQueryResults";
import { validateExecutableSql } from "../../sqlite/sqlSafety";
import { lessonDefinitions } from "../data";
import { lessonDefinitionSchema } from "../lessonSchemas";
import { findMissingConstructs } from "../utils/sqlConstructs";
import { deriveExpectedResult, executeDefinitionSql } from "./deriveExpectedResult";
import { getChapters, getLessonPayload, getLessonSummaries } from "./lessonRepository";

async function getAllLessonPayloads() {
  const summaries = await getLessonSummaries();
  return Promise.all(summaries.map((summary) => getLessonPayload(summary.id)));
}

describe("lessonRepository", () => {
  it("returns chapters sorted by order", () => {
    const chapters = getChapters();

    expect(chapters.map((chapter) => chapter.id)).toEqual([
      "select-basics",
      "filtering",
      "ordering",
    ]);
  });

  it("derives a non-empty expected result for every lesson", async () => {
    const payloads = await getAllLessonPayloads();

    expect(payloads.length).toBeGreaterThanOrEqual(10);

    for (const payload of payloads) {
      expect(payload).toBeDefined();
      expect(
        payload?.lesson.expectedResult.columns.length,
        `Lesson ${payload?.lesson.id} has no expected columns`,
      ).toBeGreaterThan(0);
      expect(
        payload?.lesson.expectedResult.rows.length,
        `Lesson ${payload?.lesson.id} has no expected rows`,
      ).toBeGreaterThan(0);
    }
  });

  it("accepts every lesson's solutionSql under its own safety rules", async () => {
    const payloads = await getAllLessonPayloads();

    for (const payload of payloads) {
      const lesson = payload?.lesson;

      expect(lesson).toBeDefined();

      if (lesson) {
        const safetyResult = validateExecutableSql(lesson.solutionSql, lesson.allowedStatements);
        expect(safetyResult.ok, `solutionSql rejected for ${lesson.id}`).toBe(true);
      }
    }
  });

  it("derives ordered results that reflect the solution's ORDER BY", async () => {
    const payload = await getLessonPayload("order-high-value-orders");

    expect(payload?.lesson.expectedResult.rows.map((row) => row["total_amount"])).toEqual([
      21_500, 12_800, 9_300, 9_000, 7_600, 4_200,
    ]);
  });

  it("derives only the selected columns", async () => {
    const payload = await getLessonPayload("select-customer-contact");

    expect(payload?.lesson.expectedResult.columns).toEqual(["name", "email"]);
  });

  it("satisfies each lesson's own required constructs with its solutionSql", async () => {
    const payloads = await getAllLessonPayloads();

    for (const payload of payloads) {
      const lesson = payload?.lesson;

      if (lesson) {
        expect(
          findMissingConstructs(lesson.solutionSql, lesson.requiredConstructs),
          `solutionSql of ${lesson.id} does not use its own required constructs`,
        ).toEqual([]);
      }
    }
  });

  it("does not include counterexamples in the client payload", async () => {
    const payloads = await getAllLessonPayloads();

    for (const payload of payloads) {
      expect(payload?.lesson).not.toHaveProperty("counterexamples");
    }
  });
});

describe("lesson counterexamples", () => {
  // データセットが「ありがちな誤答」を正解と区別できることを保証する。
  // 誤答が偶然同じ結果になる場合は、境界値となる行を ecDataset に追加すること。
  it("rejects every documented counterexample", async () => {
    const definitions = v.parse(v.array(lessonDefinitionSchema), lessonDefinitions);
    const cases = definitions.flatMap((definition) =>
      definition.counterexamples.map((counterexample) => ({ definition, counterexample })),
    );

    expect(cases.length).toBeGreaterThan(0);

    await Promise.all(
      cases.map(async ({ definition, counterexample }) => {
        const [expected, actual] = await Promise.all([
          deriveExpectedResult(definition),
          executeDefinitionSql(definition.schema, counterexample.sql),
        ]);
        const comparison = compareQueryResults(expected, actual, definition.compareMode);

        expect(
          comparison.ok,
          `${definition.id}: 誤答が正解扱いになっています。データセットに判別用の行を追加してください。\nSQL: ${counterexample.sql}\n理由: ${counterexample.reason}`,
        ).toBe(false);
      }),
    );
  });
});
