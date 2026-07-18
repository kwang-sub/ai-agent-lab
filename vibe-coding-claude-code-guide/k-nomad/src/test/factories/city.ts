import type { City } from "@/lib/cities";

export function createCity(overrides: Partial<City> = {}): City {
  return {
    id: "city-1",
    name: "서울",
    slug: "seoul",
    region: "수도권",
    budget: "200만원 이상",
    environment: "코워킹 필수",
    bestSeason: "가을",
    likes: 10,
    dislikes: 2,
    userVote: null,
    visual: "from-slate-950 via-slate-700 to-amber-300",
    mood: "초연결 대도시",
    ...overrides,
  };
}
