import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CityReactionCard } from "@/app/cities/[citySlug]/city-reaction-card";

const { routerMock, updateCityVoteMock } = vi.hoisted(() => ({
  routerMock: {
    push: vi.fn(),
    refresh: vi.fn(),
  },
  updateCityVoteMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("@/app/actions/city-votes", () => ({
  updateCityVote: updateCityVoteMock,
}));

function renderCard(
  props: Partial<ComponentProps<typeof CityReactionCard>> = {},
) {
  return render(
    <CityReactionCard
      citySlug="seoul"
      initialLikes={10}
      initialDislikes={2}
      initialVote={null}
      isAuthenticated
      {...props}
    />,
  );
}

describe("CityReactionCard", () => {
  beforeEach(() => {
    routerMock.push.mockReset();
    routerMock.refresh.mockReset();
    updateCityVoteMock.mockReset();
    updateCityVoteMock.mockResolvedValue({});
  });

  it("renders initial counts and selected like state", () => {
    renderCard({ initialVote: "like" });

    expect(screen.getByRole("button", { name: /10\s*좋아요/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /2\s*싫어요/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("redirects unauthenticated users to login", async () => {
    renderCard({ isAuthenticated: false });

    await userEvent.click(screen.getByRole("button", { name: /10\s*좋아요/ }));

    expect(
      screen.getByText("로그인 후 투표할 수 있습니다."),
    ).toBeInTheDocument();
    expect(routerMock.push).toHaveBeenCalledWith("/login");
    expect(updateCityVoteMock).not.toHaveBeenCalled();
  });

  it("toggles like votes and refreshes after saving", async () => {
    renderCard();

    const likeButton = screen.getByRole("button", { name: /10\s*좋아요/ });
    await userEvent.click(likeButton);

    expect(screen.getByRole("button", { name: /11\s*좋아요/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(updateCityVoteMock).toHaveBeenCalledWith("seoul", "like");
    await waitFor(() => expect(routerMock.refresh).toHaveBeenCalled());

    await userEvent.click(screen.getByRole("button", { name: /11\s*좋아요/ }));

    expect(screen.getByRole("button", { name: /10\s*좋아요/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("switches from an existing like to dislike", async () => {
    renderCard({ initialVote: "like" });

    await userEvent.click(screen.getByRole("button", { name: /2\s*싫어요/ }));

    expect(screen.getByRole("button", { name: /9\s*좋아요/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: /3\s*싫어요/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(updateCityVoteMock).toHaveBeenCalledWith("seoul", "dislike");
  });

  it("shows action errors returned by the server action", async () => {
    updateCityVoteMock.mockResolvedValue({ error: "저장 실패" });
    renderCard();

    await userEvent.click(screen.getByRole("button", { name: /10\s*좋아요/ }));

    expect(await screen.findByText("저장 실패")).toBeInTheDocument();
  });
});
