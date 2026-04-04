const { test, expect } = require("@playwright/test");

test("web game loads and runs a simple script", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Toy Robot" })).toBeVisible();
  await expect(page.locator("#board .cell")).toHaveCount(36);

  await page.getByRole("button", { name: "Example A" }).click();
  await page.getByRole("button", { name: "Run All" }).click();

  await expect(page.locator("#state-line")).toHaveText("0,1,NORTH");
  await expect(page.locator("#latest-status")).toContainText("0,1,NORTH");
  await expect(page.locator("#log")).toContainText("REPORT");
});
