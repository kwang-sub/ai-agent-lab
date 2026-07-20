import { expect, test } from "@playwright/test";

import { routes } from "../helpers/routes";
import { cities } from "../helpers/test-data";

test.describe("city detail", () => {
  test("exposes a detail link and renders the city detail page", async ({ page }) => {
    await page.goto(routes.home);
    await expect(page.getByLabel("도시 리스트 검색")).toBeVisible();

    const jejuLink = page.locator(`a[href="${routes.city(cities.jeju.slug)}"]`);
    await expect(jejuLink).toBeVisible();
    await expect(jejuLink).toHaveAttribute("href", routes.city(cities.jeju.slug));

    await page.goto(routes.city(cities.jeju.slug));
    await expect(page).toHaveURL(routes.city(cities.jeju.slug));
    await expect(page.getByRole("heading", { name: cities.jeju.name })).toBeVisible();
    await expect(page.getByText(cities.jeju.region).first()).toBeVisible();
    await expect(page.getByText(cities.jeju.budget).first()).toBeVisible();
    await expect(page.getByText(cities.jeju.environment).first()).toBeVisible();
    await expect(page.getByText(cities.jeju.bestSeason).first()).toBeVisible();
  });

  test("returns from detail to the city list", async ({ page }) => {
    await page.goto(routes.city(cities.jeju.slug));

    await page.getByRole("link", { name: /도시 리스트/ }).click();

    await expect(page).toHaveURL(routes.home);
    await expect(page.getByRole("heading", { name: "도시 리스트" })).toBeVisible();
  });
});
