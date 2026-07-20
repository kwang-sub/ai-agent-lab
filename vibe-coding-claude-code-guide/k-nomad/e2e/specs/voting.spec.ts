import { expect, test } from "@playwright/test";

import { routes } from "../helpers/routes";
import { cities } from "../helpers/test-data";

test.describe("city voting", () => {
  test("redirects unauthenticated users to login when voting", async ({ page }) => {
    await page.goto(routes.city(cities.jeju.slug));

    await page.getByRole("button", { name: /좋아요/ }).click();

    await expect(page).toHaveURL(routes.login);
    await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
    await expect(
      page.getByText("K-NOMAD 도시 탐색을 이어가려면 계정으로 로그인하세요."),
    ).toBeVisible();
  });
});
