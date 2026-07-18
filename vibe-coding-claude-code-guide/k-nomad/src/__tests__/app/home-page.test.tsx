import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createCity } from "@/test/factories/city";

const {
  authGetUserMock,
  cityExplorerMock,
  createSupabaseServerClientMock,
  getCitiesMock,
} = vi.hoisted(() => ({
  authGetUserMock: vi.fn(),
  cityExplorerMock: vi.fn(() => null),
  createSupabaseServerClientMock: vi.fn(),
  getCitiesMock: vi.fn(),
}));

vi.mock("@/lib/cities", () => ({
  getCities: getCitiesMock,
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}));

vi.mock("@/app/city-explorer", () => ({
  CityExplorer: cityExplorerMock,
}));

vi.mock("@/components/auth-nav", () => ({
  AuthNav: () => null,
}));

describe("Home page", () => {
  beforeEach(() => {
    getCitiesMock.mockReset();
    cityExplorerMock.mockClear();
    authGetUserMock.mockReset();
    createSupabaseServerClientMock.mockResolvedValue({
      auth: { getUser: authGetUserMock },
    });
  });

  it("renders hero metrics from loaded cities and passes auth state", async () => {
    const cities = [
      createCity({ slug: "seoul", likes: 10 }),
      createCity({ slug: "busan", likes: 20 }),
    ];
    getCitiesMock.mockResolvedValue(cities);
    authGetUserMock.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const { default: Home } = await import("@/app/page");
    render(await Home());

    expect(screen.getByText("대한민국에서 노마드로 살기 좋은 도시를 찾아보세요")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(cityExplorerMock).toHaveBeenCalledWith(
      { cities, isAuthenticated: true },
      undefined,
    );
  });

  it("passes unauthenticated state when there is no user", async () => {
    getCitiesMock.mockResolvedValue([createCity()]);
    authGetUserMock.mockResolvedValue({ data: { user: null } });

    const { default: Home } = await import("@/app/page");
    render(await Home());

    expect(cityExplorerMock).toHaveBeenCalledWith(
      { cities: [expect.objectContaining({ slug: "seoul" })], isAuthenticated: false },
      undefined,
    );
  });
});
