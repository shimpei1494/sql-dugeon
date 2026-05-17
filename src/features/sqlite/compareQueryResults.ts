import type { Lesson, QueryResult, SqlValue } from "../lessons/types";

export type QueryResultComparison =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

function normalizeValue(value: SqlValue): SqlValue {
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  return value;
}

function createRowSignature(columns: string[], row: QueryResult["rows"][number]): string {
  return JSON.stringify(columns.map((column) => normalizeValue(row[column] ?? null)));
}

function compareColumns(expected: string[], actual: string[]): QueryResultComparison {
  if (expected.length !== actual.length) {
    return {
      ok: false,
      message: `列数が違います。期待: ${expected.length} 列 / 実際: ${actual.length} 列`,
    };
  }

  const mismatchedIndex = expected.findIndex((column, index) => column !== actual[index]);

  if (mismatchedIndex >= 0) {
    return {
      ok: false,
      message: `列が違います。${mismatchedIndex + 1} 列目は ${expected[mismatchedIndex]} を期待しています。`,
    };
  }

  return { ok: true };
}

function compareOrderedRows(expected: QueryResult, actual: QueryResult): QueryResultComparison {
  const mismatchedIndex = expected.rows.findIndex(
    (row, index) =>
      createRowSignature(expected.columns, row) !==
      createRowSignature(expected.columns, actual.rows[index] ?? {}),
  );

  if (mismatchedIndex >= 0) {
    return {
      ok: false,
      message: `${mismatchedIndex + 1} 行目の値が期待結果と違います。`,
    };
  }

  return { ok: true };
}

function compareUnorderedRows(expected: QueryResult, actual: QueryResult): QueryResultComparison {
  const expectedCounts = new Map<string, number>();

  for (const row of expected.rows) {
    const signature = createRowSignature(expected.columns, row);
    expectedCounts.set(signature, (expectedCounts.get(signature) ?? 0) + 1);
  }

  for (const row of actual.rows) {
    const signature = createRowSignature(expected.columns, row);
    const currentCount = expectedCounts.get(signature) ?? 0;

    if (currentCount === 0) {
      return {
        ok: false,
        message: "期待結果にない行が含まれています。",
      };
    }

    if (currentCount === 1) {
      expectedCounts.delete(signature);
    } else {
      expectedCounts.set(signature, currentCount - 1);
    }
  }

  if (expectedCounts.size > 0) {
    return {
      ok: false,
      message: "期待される行が不足しています。",
    };
  }

  return { ok: true };
}

export function compareQueryResults(
  expected: QueryResult,
  actual: QueryResult,
  compareMode: Lesson["compareMode"],
): QueryResultComparison {
  const columnComparison = compareColumns(expected.columns, actual.columns);

  if (!columnComparison.ok) {
    return columnComparison;
  }

  if (expected.rows.length !== actual.rows.length) {
    return {
      ok: false,
      message: `行数が違います。期待: ${expected.rows.length} 行 / 実際: ${actual.rows.length} 行`,
    };
  }

  if (compareMode === "ordered") {
    return compareOrderedRows(expected, actual);
  }

  return compareUnorderedRows(expected, actual);
}
