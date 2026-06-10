import type { Lesson } from "../types";

export type RequiredConstruct = Lesson["requiredConstructs"][number];

/** コメントと文字列リテラルを除去し、構文キーワードの誤検出を防ぐ。 */
function stripCommentsAndStrings(sql: string): string {
  return sql
    .replace(/\/\*[\s\S]*?\*\//gu, " ")
    .replace(/--.*$/gmu, " ")
    .replace(/'(?:[^']|'')*'/gu, "''");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`);
}

function buildKeywordPattern(keyword: string): RegExp {
  const tokens = keyword.trim().split(/\s+/u).map(escapeRegExp);
  return new RegExp(`(?<!\\w)${tokens.join(String.raw`\s+`)}(?!\\w)`, "iu");
}

/** SQL 中で使われていない必須構文を返す。 */
export function findMissingConstructs(
  sql: string,
  requiredConstructs: RequiredConstruct[],
): RequiredConstruct[] {
  const normalizedSql = stripCommentsAndStrings(sql);

  return requiredConstructs.filter(
    (construct) => !buildKeywordPattern(construct.keyword).test(normalizedSql),
  );
}
