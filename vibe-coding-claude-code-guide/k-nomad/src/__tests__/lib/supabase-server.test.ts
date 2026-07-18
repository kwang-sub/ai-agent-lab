import { afterEach, describe, expect, it, vi } from "vitest";

const { cookiesMock, createServerClientMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  createServerClientMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: createServerClientMock,
}));

describe("createSupabaseServerClient", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    cookiesMock.mockReset();
    createServerClientMock.mockReset();
  });

  it("creates a server client with cookie adapters", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    const cookieStore = {
      getAll: vi.fn(() => [{ name: "token", value: "abc" }]),
      set: vi.fn(),
    };
    cookiesMock.mockResolvedValue(cookieStore);
    createServerClientMock.mockReturnValue({ auth: {} });

    const { createSupabaseServerClient } = await import(
      "@/lib/supabase/server"
    );

    expect(await createSupabaseServerClient()).toEqual({ auth: {} });
    const [, , options] = createServerClientMock.mock.calls[0];

    expect(createServerClientMock).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "anon-key",
      expect.objectContaining({ cookies: expect.any(Object) }),
    );
    expect(options.cookies.getAll()).toEqual([{ name: "token", value: "abc" }]);

    options.cookies.setAll([
      { name: "token", value: "next", options: { path: "/" } },
    ]);
    expect(cookieStore.set).toHaveBeenCalledWith("token", "next", { path: "/" });
  });

  it("ignores cookie write errors from Server Components", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    cookiesMock.mockResolvedValue({
      getAll: vi.fn(() => []),
      set: vi.fn(() => {
        throw new Error("readonly cookies");
      }),
    });
    createServerClientMock.mockReturnValue({ auth: {} });

    const { createSupabaseServerClient } = await import(
      "@/lib/supabase/server"
    );

    await createSupabaseServerClient();
    const [, , options] = createServerClientMock.mock.calls[0];

    expect(() =>
      options.cookies.setAll([{ name: "token", value: "next", options: {} }]),
    ).not.toThrow();
  });
});
