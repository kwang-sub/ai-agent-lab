import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthNav } from "@/components/auth-nav";

const {
  createSupabaseBrowserClientMock,
  getSessionMock,
  onAuthStateChangeMock,
  routerMock,
  signOutMock,
  unsubscribeMock,
} = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
  getSessionMock: vi.fn(),
  onAuthStateChangeMock: vi.fn(),
  routerMock: {
    refresh: vi.fn(),
  },
  signOutMock: vi.fn(),
  unsubscribeMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("@/lib/supabase", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}));

describe("AuthNav", () => {
  beforeEach(() => {
    routerMock.refresh.mockReset();
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
    signOutMock.mockReset();
    unsubscribeMock.mockReset();
    createSupabaseBrowserClientMock.mockReturnValue({
      auth: {
        getSession: getSessionMock,
        onAuthStateChange: onAuthStateChangeMock,
        signOut: signOutMock,
      },
    });
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    });
  });

  it("shows loading text while checking the session", () => {
    getSessionMock.mockReturnValue(new Promise(() => {}));

    render(<AuthNav />);

    expect(screen.getByText("확인 중")).toBeInTheDocument();
  });

  it("shows a login link when there is no session", async () => {
    getSessionMock.mockResolvedValue({ data: { session: null } });

    render(<AuthNav />);

    expect(await screen.findByRole("link", { name: "로그인" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("shows the trimmed metadata name when a user is signed in", async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          user: {
            email: "user@example.com",
            user_metadata: { name: " 홍길동 " },
          },
        },
      },
    });

    render(<AuthNav />);

    expect(await screen.findByText("홍길동")).toBeInTheDocument();
  });

  it("falls back to email and then generic display names", async () => {
    let authStateCallback:
      | ((_event: string, session: { user: unknown } | null) => void)
      | undefined;
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          user: {
            email: "user@example.com",
            user_metadata: {},
          },
        },
      },
    });
    onAuthStateChangeMock.mockImplementation((callback) => {
      authStateCallback = callback;
      return { data: { subscription: { unsubscribe: unsubscribeMock } } };
    });

    render(<AuthNav />);

    expect(await screen.findByText("user@example.com")).toBeInTheDocument();

    await act(async () => {
      authStateCallback?.("SIGNED_IN", {
        user: {
          email: null,
          user_metadata: {},
        },
      });
    });

    expect(screen.getByText("사용자")).toBeInTheDocument();
  });

  it("signs out, clears user state, and refreshes the router", async () => {
    signOutMock.mockResolvedValue({ error: null });
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          user: {
            email: "user@example.com",
            user_metadata: {},
          },
        },
      },
    });

    render(<AuthNav />);

    await userEvent.click(await screen.findByRole("button", { name: "로그아웃" }));

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalled();
      expect(routerMock.refresh).toHaveBeenCalled();
    });
    expect(screen.queryByText("user@example.com")).not.toBeInTheDocument();
  });

  it("unsubscribes from auth state changes on unmount", () => {
    getSessionMock.mockResolvedValue({ data: { session: null } });

    const { unmount } = render(<AuthNav />);
    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
