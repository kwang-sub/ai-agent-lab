export const cities = {
  jeju: {
    name: "제주",
    slug: "jeju",
    region: "제주도",
    budget: "100~200만원",
    environment: "자연친화",
    bestSeason: "봄",
  },
  seoul: {
    name: "서울",
    slug: "seoul",
  },
} as const;

export const filters = {
  noResultsQuery: "없는도시",
  region: "제주도",
} as const;
