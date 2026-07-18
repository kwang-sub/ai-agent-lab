import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CityExplorer } from "@/app/city-explorer";
import { createCity } from "@/test/factories/city";

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

const cities = [
  createCity({
    id: "city-1",
    name: "서울",
    slug: "seoul",
    region: "수도권",
    budget: "200만원 이상",
    environment: "코워킹 필수",
    bestSeason: "가을",
    likes: 30,
    dislikes: 3,
  }),
  createCity({
    id: "city-2",
    name: "부산",
    slug: "busan",
    region: "경상도",
    budget: "100~200만원",
    environment: "카페작업",
    bestSeason: "여름",
    likes: 20,
    dislikes: 2,
  }),
  createCity({
    id: "city-3",
    name: "춘천",
    slug: "chuncheon",
    region: "강원도",
    budget: "100만원 이하",
    environment: "자연친화",
    bestSeason: "봄",
    likes: 10,
    dislikes: 1,
  }),
];

async function selectFilter(name: string, option: string) {
  await userEvent.click(screen.getByRole("combobox", { name }));
  await userEvent.click(await screen.findByRole("option", { name: option }));
}

describe("CityExplorer", () => {
  beforeEach(() => {
    routerMock.push.mockReset();
    routerMock.refresh.mockReset();
    updateCityVoteMock.mockReset();
    updateCityVoteMock.mockResolvedValue({});
  });

  it("renders cities sorted by likes descending with detail links", () => {
    const { container } = render(
      <CityExplorer cities={[cities[2], cities[0], cities[1]]} isAuthenticated />,
    );

    const cardTitles = Array.from(
      container.querySelectorAll('[data-slot="card-title"]'),
    ).map((title) => title.textContent);

    expect(cardTitles).toEqual(["서울", "부산", "춘천"]);
    expect(screen.getAllByRole("link", { name: /상세 정보/ })[0]).toHaveAttribute(
      "href",
      "/cities/seoul",
    );
    expect(screen.getByText("3개 도시 표시")).toBeInTheDocument();
  });

  it("filters cities by search query", async () => {
    render(<CityExplorer cities={cities} isAuthenticated />);

    await userEvent.type(screen.getByLabelText("도시 리스트 검색"), "자연친화");

    expect(screen.getAllByText("춘천")).toHaveLength(2);
    expect(screen.queryByText("서울")).not.toBeInTheDocument();
    expect(screen.getByText("1개 도시 표시")).toBeInTheDocument();
  });

  it("filters by budget, region, environment, and season together", async () => {
    render(<CityExplorer cities={cities} isAuthenticated />);

    await selectFilter("예산", "100~200만원");
    await selectFilter("지역", "경상도");
    await selectFilter("환경", "카페작업");
    await selectFilter("최고 계절", "여름");

    expect(screen.getAllByText("부산")).toHaveLength(2);
    expect(screen.queryByText("서울")).not.toBeInTheDocument();
    expect(screen.queryByText("춘천")).not.toBeInTheDocument();
    expect(screen.getByText("1개 도시 표시")).toBeInTheDocument();
  });

  it("shows empty state and resets active filters", async () => {
    render(<CityExplorer cities={cities} isAuthenticated />);

    const resetButton = screen.getByRole("button", { name: "필터 초기화" });
    expect(resetButton).toBeDisabled();

    await userEvent.type(screen.getByLabelText("도시 리스트 검색"), "없는도시");

    expect(screen.getByText("조건에 맞는 도시가 없습니다.")).toBeInTheDocument();
    expect(screen.getByText("0개 도시 표시")).toBeInTheDocument();
    expect(resetButton).toBeEnabled();

    await userEvent.click(resetButton);

    expect(screen.getByText("3개 도시 표시")).toBeInTheDocument();
    expect(screen.getAllByText("서울")).toHaveLength(2);
  });

  it("renders city metadata as key-value rows", () => {
    render(<CityExplorer cities={[cities[0]]} isAuthenticated />);

    expect(screen.getAllByText("예산").length).toBeGreaterThan(0);
    expect(screen.getByText("200만원 이상")).toBeInTheDocument();
    expect(screen.getAllByText("지역").length).toBeGreaterThan(0);
    expect(screen.getAllByText("수도권").length).toBeGreaterThan(0);
    expect(screen.getAllByText("환경").length).toBeGreaterThan(0);
    expect(screen.getByText("코워킹 필수")).toBeInTheDocument();
    expect(screen.getAllByText("최고 계절").length).toBeGreaterThan(0);
    expect(screen.getByText("가을")).toBeInTheDocument();
  });

  it("redirects unauthenticated vote attempts to login", async () => {
    render(<CityExplorer cities={[cities[0]]} isAuthenticated={false} />);

    await userEvent.click(screen.getByRole("button", { name: "30" }));

    expect(
      screen.getByText("로그인 후 투표할 수 있습니다."),
    ).toBeInTheDocument();
    expect(routerMock.push).toHaveBeenCalledWith("/login");
    expect(updateCityVoteMock).not.toHaveBeenCalled();
  });

  it("optimistically updates like and dislike votes", async () => {
    render(<CityExplorer cities={[cities[0]]} isAuthenticated />);

    await userEvent.click(screen.getByRole("button", { name: "30" }));
    expect(screen.getByRole("button", { name: "31" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(updateCityVoteMock).toHaveBeenCalledWith("seoul", "like");
    await waitFor(() => expect(routerMock.refresh).toHaveBeenCalled());

    await userEvent.click(screen.getByRole("button", { name: "3" }));
    expect(screen.getByRole("button", { name: "30" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "4" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(updateCityVoteMock).toHaveBeenCalledWith("seoul", "dislike");
  });

  it("shows server action errors", async () => {
    updateCityVoteMock.mockResolvedValue({ error: "저장 실패" });
    render(<CityExplorer cities={[cities[0]]} isAuthenticated />);

    await userEvent.click(screen.getByRole("button", { name: "30" }));

    expect(await screen.findByText("저장 실패")).toBeInTheDocument();
  });
});
