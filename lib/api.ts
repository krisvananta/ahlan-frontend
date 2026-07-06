/**
 * WordPress GraphQL API — Main Re-export Barrel
 *
 * This file acts as the central hub re-exporting all modularized API domains
 * per ARCH-03 (splitting the 800-line monolith into focused modules).
 *
 * All existing imports across the codebase remain 100% compatible.
 */

export * from "./api/client";
export * from "./api/articles";
export * from "./api/magazines";
export * from "./api/products";
export * from "./api/admin";
export * from "./api/auth";
