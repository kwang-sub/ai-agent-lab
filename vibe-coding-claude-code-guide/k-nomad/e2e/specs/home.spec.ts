import { expect, test } from "@playwright/test";

import { routes } from "../helpers/routes";
import { cities, filters } from "../helpers/test-data";

function cityDetailLink(page: import("@playwright/test").Page, slug: string) {
  return page.locator(`a[href="${routes.city(slug)}"]`);
}

async function waitForHomeReady(page: import("@playwright/test").Page) {
  await expect(page.getByLabel("도시 리스트 검색")).toBeVisible();
  await expect(cityDetailLink(page, cities.jeju.slug)).toBeVisible();
}

test.describe("home city explorer", () => {
  test("shows the landing content and city list", async ({ page }) => {
    await page.goto(routes.home);
    await waitForHomeReady(page);

    await expect(
      page.getByRole("heading", {
        name: "대한민국에서 노마드로 살기 좋은 도시를 찾아보세요",
      }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "도시 리스트" })).toBeVisible();
    await expect(page.getByText(/\d+개 도시 표시/)).toBeVisible();
    await expect(page.getByRole("link", { name: /K-NOMAD/ })).toBeVisible();
  });

  test("filters cities by search text and resets the result", async ({ page }) => {
    await page.goto(routes.home);
    await waitForHomeReady(page);

    const listSearch = page.getByLabel("도시 리스트 검색");
    await listSearch.fill(cities.jeju.name);

    await expect(listSearch).toHaveValue(cities.jeju.name);
    await expect(cityDetailLink(page, cities.jeju.slug)).toBeVisible();
    await expect(cityDetailLink(page, cities.seoul.slug)).toBeHidden();

    await page.getByRole("button", { name: "필터 초기화" }).click();

    await expect(listSearch).toHaveValue("");
    await expect(cityDetailLink(page, cities.seoul.slug)).toBeVisible();
  });

  test("shows an empty state when no city matches", async ({ page }) => {
    await page.goto(routes.home);
    await waitForHomeReady(page);

    await page.getByLabel("도시 리스트 검색").fill(filters.noResultsQuery);

    await expect(page.getByText("조건에 맞는 도시가 없습니다.")).toBeVisible();
  });

  test("filters cities by region", async ({ page }) => {
    await page.goto(routes.home);
    await waitForHomeReady(page);

    await page.getByRole("combobox", { name: "지역" }).click();
    await page.getByRole("option", { name: filters.region }).click();

    await expect(cityDetailLink(page, cities.jeju.slug)).toBeVisible();
    await expect(cityDetailLink(page, cities.seoul.slug)).toBeHidden();
  });
});
