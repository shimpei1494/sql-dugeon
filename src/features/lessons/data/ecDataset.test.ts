import { describe, expect, it } from "vite-plus/test";

import type { SqlValue } from "../types";
import { orderItemsTable, ordersTable } from "./ecDataset";

describe("ecDataset", () => {
  it("keeps order_items totals consistent with orders.total_amount", () => {
    const itemTotals = new Map<SqlValue, number>();

    for (const item of orderItemsTable.rows) {
      const orderId = item["order_id"] ?? null;
      const amount = Number(item["quantity"]) * Number(item["unit_price"]);
      itemTotals.set(orderId, (itemTotals.get(orderId) ?? 0) + amount);
    }

    for (const order of ordersTable.rows) {
      expect(
        itemTotals.get(order["id"] ?? null),
        `order ${String(order["id"])} の明細合計が total_amount と一致しません`,
      ).toBe(order["total_amount"]);
    }
  });
});
