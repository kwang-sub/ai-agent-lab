import { afterEach, describe, expect, it, vi } from "vitest";

const { createBrowserClientMock } = vi.hoisted(() => ({
  createBrowserClientMock: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: createBrowserClientMock,
}));

describe("supabase client helpers", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    createBrowserClientMock.mockReset();
  });

  it("throws a clear error when Supabase env vars are missing", async () => {
    const { getSupabaseConfig } = await import("@/lib/supabase/client");

    expect(() => getSupabaseConfig()).toThrow(
      "Supabase 환경 변수가 설정되지 않았습니다.",
    );
  });

  it("returns Supabase config from environment variables", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

    const { getSupabaseConfig } = await import("@/lib/supabase/client");

    expect(getSupabaseConfig()).toEqual({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon-key",
    });
  });

  it("creates a browser client with the resolved config", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    createBrowserClientMock.mockReturnValue({ auth: {} });

    const { createSupabaseBrowserClient } = await import(
      "@/lib/supabase/client"
    );

    expect(createSupabaseBrowserClient()).toEqual({ auth: {} });
    expect(createBrowserClientMock).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "anon-key",
    );
  });
});
