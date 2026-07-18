import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/app/login/login-form";

const { createSupabaseBrowserClientMock, routerMock, signInWithPasswordMock } =
  vi.hoisted(() => ({
    createSupabaseBrowserClientMock: vi.fn(),
    routerMock: {
      push: vi.fn(),
      refresh: vi.fn(),
    },
    signInWithPasswordMock: vi.fn(),
  }));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("@/lib/supabase", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    routerMock.push.mockReset();
    routerMock.refresh.mockReset();
    signInWithPasswordMock.mockReset();
    createSupabaseBrowserClientMock.mockReturnValue({
      auth: { signInWithPassword: signInWithPasswordMock },
    });
  });

  it("shows a validation error when required fields are empty", async () => {
    render(<LoginForm />);

    await userEvent.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      screen.getByText("이메일과 비밀번호를 모두 입력하세요."),
    ).toBeInTheDocument();
    expect(signInWithPasswordMock).not.toHaveBeenCalled();
  });

  it("signs in and redirects to the home page", async () => {
    signInWithPasswordMock.mockResolvedValue({ error: null });
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText("이메일"), " user@example.com ");
    await userEvent.type(screen.getByLabelText("비밀번호"), "password");
    await userEvent.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(signInWithPasswordMock).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password",
      });
    });
    expect(
      screen.getByText("로그인되었습니다. 메인 화면으로 이동합니다."),
    ).toBeInTheDocument();
    expect(routerMock.push).toHaveBeenCalledWith("/");
    expect(routerMock.refresh).toHaveBeenCalled();
  });

  it("shows Supabase and thrown errors", async () => {
    signInWithPasswordMock.mockResolvedValueOnce({
      error: { message: "Invalid credentials" },
    });
    const { rerender } = render(<LoginForm />);

    await userEvent.type(screen.getByLabelText("이메일"), "user@example.com");
    await userEvent.type(screen.getByLabelText("비밀번호"), "password");
    await userEvent.click(screen.getByRole("button", { name: "로그인" }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();

    signInWithPasswordMock.mockRejectedValueOnce(new Error("network failed"));
    rerender(<LoginForm />);

    await userEvent.clear(screen.getByLabelText("이메일"));
    await userEvent.type(screen.getByLabelText("이메일"), "user@example.com");
    await userEvent.clear(screen.getByLabelText("비밀번호"));
    await userEvent.type(screen.getByLabelText("비밀번호"), "password");
    await userEvent.click(screen.getByRole("button", { name: "로그인" }));

    expect(await screen.findByText("network failed")).toBeInTheDocument();
  });

  it("links to registration", () => {
    render(<LoginForm />);

    expect(screen.getByRole("link", { name: "회원가입" })).toHaveAttribute(
      "href",
      "/register",
    );
  });
});
