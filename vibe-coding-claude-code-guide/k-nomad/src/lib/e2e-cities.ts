import type { City } from "@/lib/cities";

export function isUsingE2ECityFixtures() {
  return process.env.E2E_USE_FIXTURE_CITIES === "true";
}

export const e2eCities: City[] = [
  {
    id: "e2e-city-seoul",
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
  },
  {
    id: "e2e-city-jeju",
    name: "제주",
    slug: "jeju",
    region: "제주도",
    budget: "100~200만원",
    environment: "자연친화",
    bestSeason: "봄",
    likes: 8,
    dislikes: 1,
    userVote: null,
    visual: "from-emerald-950 via-teal-800 to-amber-200",
    mood: "자연 집중 환경",
  },
  {
    id: "e2e-city-busan",
    name: "부산",
    slug: "busan",
    region: "경상도",
    budget: "100~200만원",
    environment: "카페작업",
    bestSeason: "여름",
    likes: 6,
    dislikes: 1,
    userVote: null,
    visual: "from-slate-900 via-cyan-800 to-stone-200",
    mood: "해변 워케이션",
  },
];
