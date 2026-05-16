import type { QueryResult } from "../lessons/types";

export type SqlExecutionResult =
  | {
      ok: true;
      result: QueryResult;
    }
  | {
      ok: false;
      message: string;
    };
