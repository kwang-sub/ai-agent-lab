import { afterEach, describe, expect, it, vi } from "vitest";

const { createServerClientMock, nextResponseNextMock } = vi.hoisted(() => ({
  createServerClientMock: vi.fn(),
  nextResponseNextMock: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: createServerClientMock,
}));

vi.mock("next/server", () => ({
  NextResponse: {
    next: nextResponseNextMock,
  },
}));

function createRequest() {
  return {
    cookies: {
      getAll: vi.fn(() => [{ name: "token", value: "abc" }]),
      set: vi.fn(),
    },
  };
}

function createResponse() {
  return {
    cookies: {
      set: vi.fn(),
    },
    headers: {
      set: vi.fn(),
    },
  };
}

describe("middleware", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    createServerClientMock.mockReset();
    nextResponseNextMock.mockReset();
  });

  it("returns the default response without Supabase env vars", async () => {
    const response = createResponse();
    nextResponseNextMock.mockReturnValue(response);

    const { middleware } = await import("../../middleware");
    const request = createRequest();

    await expect(middleware(request as never)).resolves.toBe(response);
    expect(createServerClientMock).not.toHaveBeenCalled();
  });

  it("refreshes auth and wires Supabase cookie adapters", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    const response = createResponse();
    const request = createRequest();
    const getUserMock = vi.fn().mockResolvedValue({ data: { user: null } });
    nextResponseNextMock.mockReturnValue(response);
    createServerClientMock.mockReturnValue({
      auth: { getUser: getUserMock },
    });

    const { middleware } = await import("../../middleware");

    await expect(middleware(request as never)).resolves.toBe(response);
    expect(createServerClientMock).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "anon-key",
      expect.objectContaining({ cookies: expect.any(Object) }),
    );
    const [, , options] = createServerClientMock.mock.calls[0];

    expect(options.cookies.getAll()).toEqual([{ name: "token", value: "abc" }]);
    options.cookies.setAll(
      [{ name: "token", value: "next", options: { path: "/" } }],
      { "x-test": "1" },
    );
    expect(request.cookies.set).toHaveBeenCalledWith("token", "next");
    expect(response.cookies.set).toHaveBeenCalledWith("token", "next", {
      path: "/",
    });
    expect(response.headers.set).toHaveBeenCalledWith("x-test", "1");
    expect(getUserMock).toHaveBeenCalled();
  });

  it("keeps the static asset exclusions in the matcher", async () => {
    const { config } = await import("../../middleware");

    expect(config.matcher[0]).toContain("_next/static");
    expect(config.matcher[0]).toContain("_next/image");
    expect(config.matcher[0]).toContain("favicon.ico");
  });
});
