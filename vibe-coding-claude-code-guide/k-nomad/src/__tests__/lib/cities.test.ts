import { beforeEach, describe, expect, it, vi } from "vitest";

const { createSupabaseServerClientMock, rpcMock } = vi.hoisted(() => ({
  createSupabaseServerClientMock: vi.fn(),
  rpcMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}));

describe("cities data access", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    createSupabaseServerClientMock.mockResolvedValue({ rpc: rpcMock });
  });

  it("loads, maps, and sorts cities by likes descending", async () => {
    rpcMock.mockResolvedValue({
      data: [
        {
          id: "city-1",
          name: "부산",
          slug: "busan",
          region: "경상도",
          budget: "100~200만원",
          environment: "카페작업",
          best_season: "여름",
          visual: "from-slate-900 via-cyan-800 to-stone-200",
          mood: "해변 워케이션",
          likes: 5,
          dislikes: 1,
          user_vote: "like",
        },
        {
          id: "city-2",
          name: "서울",
          slug: "seoul",
          region: "수도권",
          budget: "200만원 이상",
          environment: "코워킹 필수",
          best_season: "가을",
          visual: "from-slate-950 via-slate-700 to-amber-300",
          mood: "초연결 대도시",
          likes: 20,
          dislikes: 3,
          user_vote: null,
        },
      ],
      error: null,
    });

    const { getCities } = await import("@/lib/cities");

    await expect(getCities()).resolves.toEqual([
      expect.objectContaining({
        slug: "seoul",
        bestSeason: "가을",
        userVote: null,
        likes: 20,
      }),
      expect.objectContaining({
        slug: "busan",
        bestSeason: "여름",
        userVote: "like",
        likes: 5,
      }),
    ]);
    expect(rpcMock).toHaveBeenCalledWith("get_cities_with_votes");
  });

  it("returns an empty array when RPC data is null", async () => {
    rpcMock.mockResolvedValue({ data: null, error: null });

    const { getCities } = await import("@/lib/cities");

    await expect(getCities()).resolves.toEqual([]);
  });

  it("throws a wrapped error when the RPC fails", async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { message: "permission denied" },
    });

    const { getCities } = await import("@/lib/cities");

    await expect(getCities()).rejects.toThrow(
      "도시 데이터를 불러오지 못했습니다: permission denied",
    );
  });

  it("finds a city by slug", async () => {
    rpcMock.mockResolvedValue({
      data: [
        {
          id: "city-1",
          name: "서울",
          slug: "seoul",
          region: "수도권",
          budget: "200만원 이상",
          environment: "코워킹 필수",
          best_season: "가을",
          visual: "from-slate-950 via-slate-700 to-amber-300",
          mood: "초연결 대도시",
          likes: 10,
          dislikes: 2,
          user_vote: null,
        },
      ],
      error: null,
    });

    const { getCityBySlug } = await import("@/lib/cities");

    await expect(getCityBySlug("seoul")).resolves.toEqual(
      expect.objectContaining({ slug: "seoul" }),
    );
    await expect(getCityBySlug("missing")).resolves.toBeUndefined();
  });
});
