/**
 * WordPress GraphQL API — Merchandise Products
 */

import type { WPProduct } from "@/types";
import { mockProducts } from "../mock-data";

/** Fetch merchandise products (still using mock data) */
export async function getProducts(): Promise<WPProduct[]> {
  return mockProducts;
}
