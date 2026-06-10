import type { TableDefinition } from "../types";

/**
 * 全 Lesson が共有する EC サイト風データセット。
 * テーブルを追加・変更したら、依存する Lesson の solutionSql を見直すこと。
 */
export const customersTable: TableDefinition = {
  name: "customers",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "name", type: "TEXT" },
    { name: "email", type: "TEXT" },
    { name: "age", type: "INTEGER" },
    { name: "city", type: "TEXT" },
  ],
  rows: [
    { id: 1, name: "Aoi Tanaka", email: "aoi@example.com", age: 24, city: "Tokyo" },
    { id: 2, name: "Ren Sato", email: "ren@example.com", age: 32, city: "Osaka" },
    { id: 3, name: "Mio Suzuki", email: "mio@example.com", age: 29, city: "Fukuoka" },
    { id: 4, name: "Kai Ito", email: "kai@example.com", age: 41, city: "Tokyo" },
  ],
};

export const ordersTable: TableDefinition = {
  name: "orders",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "customer_id", type: "INTEGER" },
    { name: "ordered_at", type: "TEXT" },
    { name: "total_amount", type: "INTEGER" },
  ],
  rows: [
    { id: 101, customer_id: 2, ordered_at: "2026-04-21", total_amount: 12_800 },
    { id: 102, customer_id: 1, ordered_at: "2026-05-02", total_amount: 4_200 },
    { id: 103, customer_id: 4, ordered_at: "2026-05-06", total_amount: 21_500 },
    { id: 104, customer_id: 2, ordered_at: "2026-05-11", total_amount: 7_600 },
    { id: 105, customer_id: 3, ordered_at: "2026-05-13", total_amount: 9_300 },
  ],
};
