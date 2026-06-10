import type { TableDefinition } from "../types";

/**
 * 全 Lesson が共有する EC サイト風データセット。
 * テーブルを追加・変更したら、依存する Lesson の solutionSql を見直すこと。
 *
 * 採点は「結果一致」で行うため、誤答 SQL が偶然同じ結果にならないよう
 * 境界値となる行を意図的に含めている（各 Lesson の counterexamples テストが
 * 判別できることを保証する）。例:
 * - Tomio Kato: age = 30（>= 30 と > 30 の判別）、名前の途中に "mio"
 *   （LIKE 'Mio%' と '%Mio%' の判別）、city = Kyoto（IN の判別）
 * - Hana Mori: 注文が 1 件も無い顧客（LEFT JOIN と INNER JOIN の判別）
 * - 注文 106: total_amount = 9000（>= 9000 と > 9000 の判別）
 * - 注文 107: total_amount = 5000（BETWEEN の両端を含む挙動の判別）
 * - delivered_at: NULL を含む列（IS NULL と = NULL の判別）
 * - SQL Primer / Data Modeling Guide: 同価格 3200（RANK と DENSE_RANK の判別）
 * - Gift Box: category_id が NULL（NOT IN + NULL の罠の再現用）
 * - Tumbler: 一度も注文されていない商品（NOT EXISTS 練習用）
 * - Outdoor: 商品が 1 つも無いカテゴリ（NOT EXISTS 練習用）
 *
 * order_items の quantity * unit_price の合計は、対応する orders.total_amount と
 * 一致するように作ってある（学習者がデータの矛盾で混乱しないため）。
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
    { id: 5, name: "Tomio Kato", email: "tomio@example.com", age: 30, city: "Kyoto" },
    { id: 6, name: "Hana Mori", email: "hana@example.com", age: 27, city: "Osaka" },
  ],
};

export const ordersTable: TableDefinition = {
  name: "orders",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "customer_id", type: "INTEGER" },
    { name: "ordered_at", type: "TEXT" },
    { name: "total_amount", type: "INTEGER" },
    { name: "delivered_at", type: "TEXT", nullable: true },
  ],
  rows: [
    {
      id: 101,
      customer_id: 2,
      ordered_at: "2026-04-21",
      total_amount: 12_800,
      delivered_at: "2026-04-23",
    },
    {
      id: 102,
      customer_id: 1,
      ordered_at: "2026-05-02",
      total_amount: 4_200,
      delivered_at: "2026-05-04",
    },
    {
      id: 103,
      customer_id: 4,
      ordered_at: "2026-05-06",
      total_amount: 21_500,
      delivered_at: null,
    },
    {
      id: 104,
      customer_id: 2,
      ordered_at: "2026-05-11",
      total_amount: 7_600,
      delivered_at: "2026-05-13",
    },
    {
      id: 105,
      customer_id: 3,
      ordered_at: "2026-05-13",
      total_amount: 9_300,
      delivered_at: null,
    },
    {
      id: 106,
      customer_id: 5,
      ordered_at: "2026-04-28",
      total_amount: 9_000,
      delivered_at: "2026-04-30",
    },
    {
      id: 107,
      customer_id: 1,
      ordered_at: "2026-05-18",
      total_amount: 5_000,
      delivered_at: null,
    },
  ],
};

export const categoriesTable: TableDefinition = {
  name: "categories",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "name", type: "TEXT" },
  ],
  rows: [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Books" },
    { id: 3, name: "Coffee" },
    { id: 4, name: "Outdoor" },
  ],
};

export const productsTable: TableDefinition = {
  name: "products",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "name", type: "TEXT" },
    { name: "category_id", type: "INTEGER", nullable: true },
    { name: "price", type: "INTEGER" },
  ],
  rows: [
    { id: 1, name: "Wireless Earbuds", category_id: 1, price: 8_700 },
    { id: 2, name: "Mechanical Keyboard", category_id: 1, price: 12_800 },
    { id: 3, name: "USB-C Cable", category_id: 1, price: 2_900 },
    { id: 4, name: "SQL Primer", category_id: 2, price: 3_200 },
    { id: 5, name: "Data Modeling Guide", category_id: 2, price: 3_200 },
    { id: 6, name: "Drip Coffee Set", category_id: 3, price: 3_800 },
    { id: 7, name: "Coffee Beans 500g", category_id: 3, price: 2_100 },
    { id: 8, name: "Tumbler", category_id: 3, price: 2_500 },
    { id: 9, name: "Gift Box", category_id: null, price: 4_500 },
  ],
};

export const orderItemsTable: TableDefinition = {
  name: "order_items",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "order_id", type: "INTEGER" },
    { name: "product_id", type: "INTEGER" },
    { name: "quantity", type: "INTEGER" },
    { name: "unit_price", type: "INTEGER" },
  ],
  rows: [
    { id: 1, order_id: 101, product_id: 2, quantity: 1, unit_price: 12_800 },
    { id: 2, order_id: 102, product_id: 7, quantity: 2, unit_price: 2_100 },
    { id: 3, order_id: 103, product_id: 2, quantity: 1, unit_price: 12_800 },
    { id: 4, order_id: 103, product_id: 1, quantity: 1, unit_price: 8_700 },
    { id: 5, order_id: 104, product_id: 6, quantity: 2, unit_price: 3_800 },
    { id: 6, order_id: 105, product_id: 4, quantity: 1, unit_price: 3_200 },
    { id: 7, order_id: 105, product_id: 5, quantity: 1, unit_price: 3_200 },
    { id: 8, order_id: 105, product_id: 3, quantity: 1, unit_price: 2_900 },
    { id: 9, order_id: 106, product_id: 9, quantity: 2, unit_price: 4_500 },
    { id: 10, order_id: 107, product_id: 7, quantity: 1, unit_price: 2_100 },
    { id: 11, order_id: 107, product_id: 3, quantity: 1, unit_price: 2_900 },
  ],
};
