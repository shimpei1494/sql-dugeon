import type { Lesson, QueryResult, SqlValue } from "../lessons/types";

export type QueryRowDiff = {
  /** true の位置の期待行は、実行結果に対応する行がありません。 */
  expectedRowFlags: boolean[];
  /** true の位置の実行結果行は、期待結果に対応する行がありません。 */
  actualRowFlags: boolean[];
};

export type QueryResultComparison =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
      rowDiff?: QueryRowDiff;
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
      message: `列数が違います。期待: ${expected.length} 列（${expected.join(", ")}）/ 実際: ${actual.length} 列（${actual.join(", ")}）`,
    };
  }

  const mismatchedIndex = expected.findIndex((column, index) => column !== actual[index]);

  if (mismatchedIndex >= 0) {
    return {
      ok: false,
      message: `列が違います。${mismatchedIndex + 1} 列目は ${expected[mismatchedIndex]} を期待していますが、実際は ${actual[mismatchedIndex]} でした。`,
    };
  }

  return { ok: true };
}

function diffOrderedRows(expectedSignatures: string[], actualSignatures: string[]): QueryRowDiff {
  return {
    expectedRowFlags: expectedSignatures.map(
      (signature, index) => signature !== actualSignatures[index],
    ),
    actualRowFlags: actualSignatures.map(
      (signature, index) => signature !== expectedSignatures[index],
    ),
  };
}

function diffUnorderedRows(expectedSignatures: string[], actualSignatures: string[]): QueryRowDiff {
  const unmatchedExpectedIndexes = new Map<string, number[]>();

  expectedSignatures.forEach((signature, index) => {
    const indexes = unmatchedExpectedIndexes.get(signature);

    if (indexes) {
      indexes.push(index);
    } else {
      unmatchedExpectedIndexes.set(signature, [index]);
    }
  });

  const actualRowFlags = actualSignatures.map((signature) => {
    const indexes = unmatchedExpectedIndexes.get(signature);

    if (indexes && indexes.length > 0) {
      indexes.shift();
      return false;
    }

    return true;
  });

  const expectedRowFlags = expectedSignatures.map(() => false);

  for (const indexes of unmatchedExpectedIndexes.values()) {
    for (const index of indexes) {
      expectedRowFlags[index] = true;
    }
  }

  return { expectedRowFlags, actualRowFlags };
}

function hasFlaggedRow(rowDiff: QueryRowDiff): boolean {
  return rowDiff.expectedRowFlags.includes(true) || rowDiff.actualRowFlags.includes(true);
}

function createRowDiffMessage(
  expected: QueryResult,
  actual: QueryResult,
  compareMode: Lesson["compareMode"],
  expectedSignatures: string[],
  actualSignatures: string[],
  rowDiff: QueryRowDiff,
): string {
  if (expected.rows.length !== actual.rows.length) {
    return `行数が違います。期待: ${expected.rows.length} 行 / 実際: ${actual.rows.length} 行`;
  }

  if (
    compareMode === "ordered" &&
    !hasFlaggedRow(diffUnorderedRows(expectedSignatures, actualSignatures))
  ) {
    return "値は揃っていますが、行の並び順が期待結果と違います。";
  }

  const mismatchedRowCount = rowDiff.actualRowFlags.filter(Boolean).length;
  return `${mismatchedRowCount} 行が期待結果と一致しません。`;
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

  const expectedSignatures = expected.rows.map((row) => createRowSignature(expected.columns, row));
  const actualSignatures = actual.rows.map((row) => createRowSignature(expected.columns, row));

  const rowDiff =
    compareMode === "ordered"
      ? diffOrderedRows(expectedSignatures, actualSignatures)
      : diffUnorderedRows(expectedSignatures, actualSignatures);

  if (!hasFlaggedRow(rowDiff)) {
    return { ok: true };
  }

  return {
    ok: false,
    message: createRowDiffMessage(
      expected,
      actual,
      compareMode,
      expectedSignatures,
      actualSignatures,
      rowDiff,
    ),
    rowDiff,
  };
}
