import type { Lesson } from "../lessons/types";

export type SqlSafetyResult =
  | {
      ok: true;
      normalizedSql: string;
    }
  | {
      ok: false;
      message: string;
    };

const forbiddenStatementPattern =
  /\b(attach|alter|create|delete|detach|drop|insert|pragma|replace|update|vacuum)\b/iu;

function removeSqlComments(sql: string): string {
  return sql.replace(/\/\*[\s\S]*?\*\//gu, " ").replace(/--.*$/gmu, " ");
}

function trimTrailingSemicolon(sql: string): string {
  return sql.trim().replace(/;+$/u, "").trim();
}

export function validateExecutableSql(
  sql: string,
  allowedStatements: Lesson["allowedStatements"],
): SqlSafetyResult {
  const normalizedSql = trimTrailingSemicolon(removeSqlComments(sql));

  if (!normalizedSql) {
    return {
      ok: false,
      message: "SQL を入力してください。",
    };
  }

  if (normalizedSql.includes(";")) {
    return {
      ok: false,
      message: "Phase 2 では 1 つの SQL 文だけ実行できます。",
    };
  }

  if (forbiddenStatementPattern.test(normalizedSql)) {
    return {
      ok: false,
      message: "Phase 2 では SELECT / WITH 系の SQL だけ実行できます。",
    };
  }

  const startsWithSelect = /^\s*select\b/iu.test(normalizedSql);
  const startsWithWith = /^\s*with\b/iu.test(normalizedSql);

  if (startsWithSelect && allowedStatements.includes("select")) {
    return { ok: true, normalizedSql };
  }

  if (startsWithWith && allowedStatements.includes("with")) {
    return { ok: true, normalizedSql };
  }

  return {
    ok: false,
    message: `この Lesson で許可されている SQL は ${allowedStatements.join(" / ").toUpperCase()} です。`,
  };
}
