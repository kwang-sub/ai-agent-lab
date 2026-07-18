import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createCity } from "@/test/factories/city";

const {
  authGetUserMock,
  cityReactionCardMock,
  createSupabaseServerClientMock,
  getCityBySlugMock,
  notFoundMock,
} = vi.hoisted(() => ({
  authGetUserMock: vi.fn(),
  cityReactionCardMock: vi.fn(() => null),
  createSupabaseServerClientMock: vi.fn(),
  getCityBySlugMock: vi.fn(),
  notFoundMock: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/cities", () => ({
  getCityBySlug: getCityBySlugMock,
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

vi.mock("@/components/auth-nav", () => ({
  AuthNav: () => null,
}));

vi.mock("@/app/cities/[citySlug]/city-reaction-card", () => ({
  CityReactionCard: cityReactionCardMock,
}));

describe("City detail page", () => {
  beforeEach(() => {
    getCityBySlugMock.mockReset();
    cityReactionCardMock.mockClear();
    notFoundMock.mockClear();
    authGetUserMock.mockReset();
    createSupabaseServerClientMock.mockResolvedValue({
      auth: { getUser: authGetUserMock },
    });
  });

  it("generates city metadata", async () => {
    getCityBySlugMock.mockResolvedValue(createCity({ name: "서울" }));

    const { generateMetadata } = await import("@/app/cities/[citySlug]/page");

    await expect(
      generateMetadata({ params: Promise.resolve({ citySlug: "seoul" }) }),
    ).resolves.toEqual({
      title: "서울 상세 정보 | K-NOMAD",
      description: "서울의 예산, 지역, 환경, 최고 계절 정보를 확인하세요.",
    });
  });

  it("generates not-found metadata when the city is missing", async () => {
    getCityBySlugMock.mockResolvedValue(undefined);

    const { generateMetadata } = await import("@/app/cities/[citySlug]/page");

    await expect(
      generateMetadata({ params: Promise.resolve({ citySlug: "missing" }) }),
    ).resolves.toEqual({
      title: "도시를 찾을 수 없습니다 | K-NOMAD",
    });
  });

  it("renders city details and passes auth state to reaction card", async () => {
    const city = createCity({ slug: "seoul", name: "서울", userVote: "like" });
    getCityBySlugMock.mockResolvedValue(city);
    authGetUserMock.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const { default: CityDetailPage } = await import(
      "@/app/cities/[citySlug]/page"
    );
    render(
      await CityDetailPage({
        params: Promise.resolve({ citySlug: "seoul" }),
      }),
    );

    expect(screen.getByRole("heading", { name: "서울" })).toBeInTheDocument();
    expect(screen.getAllByText("200만원 이상").length).toBeGreaterThan(0);
    expect(cityReactionCardMock).toHaveBeenCalledWith(
      {
        citySlug: "seoul",
        initialLikes: 10,
        initialDislikes: 2,
        initialVote: "like",
        isAuthenticated: true,
      },
      undefined,
    );
  });

  it("calls notFound when the city is missing", async () => {
    getCityBySlugMock.mockResolvedValue(undefined);
    authGetUserMock.mockResolvedValue({ data: { user: null } });

    const { default: CityDetailPage } = await import(
      "@/app/cities/[citySlug]/page"
    );

    await expect(
      CityDetailPage({ params: Promise.resolve({ citySlug: "missing" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalled();
  });
});
