import type { QueryResultComparison } from "../../sqlite/compareQueryResults";
import type { SqlExecutionResult } from "../../sqlite/sqliteTypes";
import { buildTableDdl } from "../../sqlite/tableDdl";
import type { Lesson, QueryResult, SqlValue, TableDefinition } from "../types";

export type AiQuestionPurpose = "hint" | "error" | "syntax";

export const aiQuestionPurposes: { value: AiQuestionPurpose; label: string }[] = [
  { value: "hint", label: "ヒントが欲しい" },
  { value: "error", label: "エラーの原因を知りたい" },
  { value: "syntax", label: "構文を解説してほしい" },
];

const purposeInstructions: Record<AiQuestionPurpose, string> = {
  hint: "私は SQL を学習中です。答えの SQL を直接教えず、どこを見直すべきかを段階的なヒントで教えてください。",
  error:
    "私は SQL を学習中です。以下の実行エラーの原因とエラーメッセージの読み方を初学者向けに解説してください。答えの SQL は直接教えないでください。",
  syntax:
    "私は SQL を学習中です。この課題で使う SQL 構文を、初学者向けに簡単な例を交えて解説してください。",
};

function formatValue(value: SqlValue): string {
  if (value === null) {
    return "NULL";
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  return String(value);
}

function formatMarkdownTable(columns: string[], rows: QueryResult["rows"]): string {
  const header = `| ${columns.join(" | ")} |`;
  const separator = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows.map(
    (row) => `| ${columns.map((column) => formatValue(row[column] ?? null)).join(" | ")} |`,
  );

  return [header, separator, ...body].join("\n");
}

function formatSchemaSection(tables: TableDefinition[]): string {
  return tables
    .map((table) => {
      const ddl = `\`\`\`sql\n${buildTableDdl(table)}\n\`\`\``;
      const columnNames = table.columns.map((column) => column.name);
      const data = formatMarkdownTable(columnNames, table.rows);

      return `### ${table.name}\n\n${ddl}\n\nデータ:\n\n${data}`;
    })
    .join("\n\n");
}

function formatResultSection(
  executionResult: SqlExecutionResult | undefined,
  gradingResult: QueryResultComparison | undefined,
): string {
  if (!executionResult) {
    return "まだ SQL を実行していません。";
  }

  if (!executionResult.ok) {
    return `実行エラーになりました:\n\n\`\`\`\n${executionResult.message}\n\`\`\``;
  }

  const resultTable =
    executionResult.result.columns.length > 0
      ? formatMarkdownTable(executionResult.result.columns, executionResult.result.rows)
      : "（結果セットなし）";

  if (gradingResult && !gradingResult.ok) {
    return `実行はできましたが、まだ正解ではありません。\n採点メッセージ: ${gradingResult.message}\n\n実行結果:\n\n${resultTable}`;
  }

  if (gradingResult?.ok) {
    return `正解しました。\n\n実行結果:\n\n${resultTable}`;
  }

  return `実行結果:\n\n${resultTable}`;
}

type AiQuestionContextInput = {
  lesson: Lesson;
  purpose: AiQuestionPurpose;
  sql: string;
  executionResult?: SqlExecutionResult;
  gradingResult?: QueryResultComparison;
};

export function buildAiQuestionContext({
  lesson,
  purpose,
  sql,
  executionResult,
  gradingResult,
}: AiQuestionContextInput): string {
  const compareModeNote =
    lesson.compareMode === "ordered" ? "行の順序も採点対象です。" : "行の順序は問いません。";

  const sections = [
    purposeInstructions[purpose],
    `# 課題: ${lesson.title}\n\n${lesson.task}\n\nこのレッスンで学ぶ構文:\n\n\`\`\`sql\n${lesson.learningPoint.syntax}\n\`\`\`\n\n${lesson.learningPoint.description}`,
    `# テーブル定義と初期データ\n\n${formatSchemaSection(lesson.schema)}`,
    `# 期待する出力\n\n${compareModeNote}\n\n${formatMarkdownTable(
      lesson.expectedResult.columns,
      lesson.expectedResult.rows,
    )}`,
    `# 私が書いた SQL\n\n\`\`\`sql\n${sql.trim() || "（まだ書いていません）"}\n\`\`\``,
    `# 実行状況\n\n${formatResultSection(executionResult, gradingResult)}`,
  ];

  return sections.join("\n\n");
}
