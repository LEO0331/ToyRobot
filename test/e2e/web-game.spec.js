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

test("run preset works in button mode and custom preset input is validated", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Example B" }).click();
  await expect(page.locator("#selected-preset")).toContainText("Example B");

  await page.getByLabel("Use button interface").check();
  await page.getByRole("button", { name: "Run Preset" }).click();
  await expect(page.locator("#state-line")).toHaveText("0,0,WEST");

  await page.getByLabel("Custom preset name").fill("Bad Preset");
  await page.getByLabel("Custom preset commands").fill("MOVE\nREPORT");
  await page.getByRole("button", { name: "Save Preset" }).click();
  await expect(page.locator("#latest-status")).toContainText(
    "First preset command must be PLACE",
  );
});
