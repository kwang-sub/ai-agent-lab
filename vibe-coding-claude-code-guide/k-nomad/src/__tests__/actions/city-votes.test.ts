import { beforeEach, describe, expect, it, vi } from "vitest";

const { createSupabaseServerClientMock, revalidatePathMock } = vi.hoisted(
  () => ({
    createSupabaseServerClientMock: vi.fn(),
    revalidatePathMock: vi.fn(),
  }),
);

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

function queryResult<T>(result: T) {
  const chain = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    single: vi.fn(() => Promise.resolve(result)),
    maybeSingle: vi.fn(() => Promise.resolve(result)),
  };

  return chain;
}

function deleteResult(result: { error: { message: string } | null }) {
  const chain = {
    eq: vi.fn(() => chain),
    then: undefined,
  };
  chain.eq
    .mockReturnValueOnce(chain)
    .mockImplementationOnce(() => Promise.resolve(result));

  return chain;
}

describe("updateCityVote", () => {
  beforeEach(() => {
    createSupabaseServerClientMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("returns an auth error when no user is available", async () => {
    createSupabaseServerClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    });

    const { updateCityVote } = await import("@/app/actions/city-votes");

    await expect(updateCityVote("seoul", "like")).resolves.toEqual({
      error: "로그인 후 투표할 수 있습니다.",
    });
  });

  it("returns a city lookup error when the city is missing", async () => {
    const cityQuery = queryResult({
      data: null,
      error: { message: "not found" },
    });
    createSupabaseServerClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1" } },
          error: null,
        }),
      },
      from: vi.fn(() => cityQuery),
    });

    const { updateCityVote } = await import("@/app/actions/city-votes");

    await expect(updateCityVote("missing", "like")).resolves.toEqual({
      error: "도시를 찾을 수 없습니다.",
    });
  });

  it("returns current vote lookup errors", async () => {
    const cityQuery = queryResult({
      data: { id: "city-1", slug: "seoul" },
      error: null,
    });
    const currentVoteQuery = queryResult({
      data: null,
      error: { message: "vote lookup failed" },
    });
    const fromMock = vi
      .fn()
      .mockReturnValueOnce(cityQuery)
      .mockReturnValueOnce(currentVoteQuery);
    createSupabaseServerClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1" } },
          error: null,
        }),
      },
      from: fromMock,
    });

    const { updateCityVote } = await import("@/app/actions/city-votes");

    await expect(updateCityVote("seoul", "like")).resolves.toEqual({
      error: "vote lookup failed",
    });
  });

  it("deletes the current vote when the same vote is selected again", async () => {
    const cityQuery = queryResult({
      data: { id: "city-1", slug: "seoul" },
      error: null,
    });
    const currentVoteQuery = queryResult({
      data: { id: "vote-1", vote_type: "like" },
      error: null,
    });
    const deleteQuery = deleteResult({ error: null });
    const fromMock = vi
      .fn()
      .mockReturnValueOnce(cityQuery)
      .mockReturnValueOnce(currentVoteQuery)
      .mockReturnValueOnce({ delete: vi.fn(() => deleteQuery) });
    createSupabaseServerClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1" } },
          error: null,
        }),
      },
      from: fromMock,
    });

    const { updateCityVote } = await import("@/app/actions/city-votes");

    await expect(updateCityVote("seoul", "like")).resolves.toEqual({});
    expect(deleteQuery.eq).toHaveBeenCalledWith("id", "vote-1");
    expect(deleteQuery.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/cities/seoul");
  });

  it("upserts a vote when there is no matching current vote", async () => {
    const cityQuery = queryResult({
      data: { id: "city-1", slug: "seoul" },
      error: null,
    });
    const currentVoteQuery = queryResult({ data: null, error: null });
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    const fromMock = vi
      .fn()
      .mockReturnValueOnce(cityQuery)
      .mockReturnValueOnce(currentVoteQuery)
      .mockReturnValueOnce({ upsert: upsertMock });
    createSupabaseServerClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1" } },
          error: null,
        }),
      },
      from: fromMock,
    });

    const { updateCityVote } = await import("@/app/actions/city-votes");

    await expect(updateCityVote("seoul", "dislike")).resolves.toEqual({});
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        city_id: "city-1",
        user_id: "user-1",
        vote_type: "dislike",
        updated_at: expect.any(String),
      }),
      { onConflict: "city_id,user_id" },
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/cities/seoul");
  });

  it("returns delete and upsert errors", async () => {
    const { updateCityVote } = await import("@/app/actions/city-votes");

    const cityQuery = queryResult({
      data: { id: "city-1", slug: "seoul" },
      error: null,
    });
    const matchingVoteQuery = queryResult({
      data: { id: "vote-1", vote_type: "like" },
      error: null,
    });
    createSupabaseServerClientMock.mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1" } },
          error: null,
        }),
      },
      from: vi
        .fn()
        .mockReturnValueOnce(cityQuery)
        .mockReturnValueOnce(matchingVoteQuery)
        .mockReturnValueOnce({
          delete: vi.fn(() =>
            deleteResult({ error: { message: "delete failed" } }),
          ),
        }),
    });

    await expect(updateCityVote("seoul", "like")).resolves.toEqual({
      error: "delete failed",
    });

    createSupabaseServerClientMock.mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1" } },
          error: null,
        }),
      },
      from: vi
        .fn()
        .mockReturnValueOnce(cityQuery)
        .mockReturnValueOnce(queryResult({ data: null, error: null }))
        .mockReturnValueOnce({
          upsert: vi
            .fn()
            .mockResolvedValue({ error: { message: "upsert failed" } }),
        }),
    });

    await expect(updateCityVote("seoul", "like")).resolves.toEqual({
      error: "upsert failed",
    });
  });
});
