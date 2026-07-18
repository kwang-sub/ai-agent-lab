import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RegisterForm } from "@/app/register/register-form";

const { createSupabaseBrowserClientMock, routerMock, signUpMock } = vi.hoisted(
  () => ({
    createSupabaseBrowserClientMock: vi.fn(),
    routerMock: {
      push: vi.fn(),
    },
    signUpMock: vi.fn(),
  }),
);

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("@/lib/supabase", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    routerMock.push.mockReset();
    signUpMock.mockReset();
    createSupabaseBrowserClientMock.mockReturnValue({
      auth: { signUp: signUpMock },
    });
  });

  it("shows a validation error when required fields are empty", async () => {
    render(<RegisterForm />);

    await userEvent.click(screen.getByRole("button", { name: "회원가입" }));

    expect(screen.getByText("모든 항목을 입력하세요.")).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("validates password confirmation", async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText("이름"), "홍길동");
    await userEvent.type(screen.getByLabelText("이메일"), "user@example.com");
    await userEvent.type(screen.getByLabelText("비밀번호"), "password");
    await userEvent.type(screen.getByLabelText("비밀번호 확인"), "different");
    await userEvent.click(screen.getByRole("button", { name: "회원가입" }));

    expect(screen.getByText("비밀번호가 일치하지 않습니다.")).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("signs up and redirects to login", async () => {
    signUpMock.mockResolvedValue({ error: null });
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText("이름"), " 홍길동 ");
    await userEvent.type(screen.getByLabelText("이메일"), " user@example.com ");
    await userEvent.type(screen.getByLabelText("비밀번호"), "password");
    await userEvent.type(screen.getByLabelText("비밀번호 확인"), "password");
    await userEvent.click(screen.getByRole("button", { name: "회원가입" }));

    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password",
        options: {
          data: { name: "홍길동" },
        },
      });
    });
    expect(
      screen.getByText("회원가입 요청이 완료되었습니다. 로그인 화면으로 이동합니다."),
    ).toBeInTheDocument();
    expect(routerMock.push).toHaveBeenCalledWith("/login");
  });

  it("shows Supabase and thrown errors", async () => {
    signUpMock.mockResolvedValueOnce({
      error: { message: "Email already registered" },
    });
    const { rerender } = render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText("이름"), "홍길동");
    await userEvent.type(screen.getByLabelText("이메일"), "user@example.com");
    await userEvent.type(screen.getByLabelText("비밀번호"), "password");
    await userEvent.type(screen.getByLabelText("비밀번호 확인"), "password");
    await userEvent.click(screen.getByRole("button", { name: "회원가입" }));

    expect(
      await screen.findByText("Email already registered"),
    ).toBeInTheDocument();

    signUpMock.mockRejectedValueOnce(new Error("network failed"));
    rerender(<RegisterForm />);

    await userEvent.clear(screen.getByLabelText("이름"));
    await userEvent.type(screen.getByLabelText("이름"), "홍길동");
    await userEvent.clear(screen.getByLabelText("이메일"));
    await userEvent.type(screen.getByLabelText("이메일"), "user@example.com");
    await userEvent.clear(screen.getByLabelText("비밀번호"));
    await userEvent.type(screen.getByLabelText("비밀번호"), "password");
    await userEvent.clear(screen.getByLabelText("비밀번호 확인"));
    await userEvent.type(screen.getByLabelText("비밀번호 확인"), "password");
    await userEvent.click(screen.getByRole("button", { name: "회원가입" }));

    expect(await screen.findByText("network failed")).toBeInTheDocument();
  });

  it("links to login", () => {
    render(<RegisterForm />);

    expect(screen.getByRole("link", { name: "로그인" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
