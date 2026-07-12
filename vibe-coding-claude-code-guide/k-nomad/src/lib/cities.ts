export type City = {
  name: string;
  slug: string;
  region: "수도권" | "경상도" | "전라도" | "강원도" | "제주도" | "충청도";
  budget: "100만원 이하" | "100~200만원" | "200만원 이상";
  environment: "자연친화" | "도심선호" | "카페작업" | "코워킹 필수";
  bestSeason: "봄" | "여름" | "가을" | "겨울";
  likes: number;
  dislikes: number;
  visual: string;
  mood: string;
};

export const cities: City[] = [
  {
    name: "서울",
    slug: "seoul",
    region: "수도권",
    budget: "200만원 이상",
    environment: "코워킹 필수",
    bestSeason: "가을",
    likes: 156,
    dislikes: 32,
    visual: "from-slate-950 via-slate-700 to-amber-300",
    mood: "초연결 대도시",
  },
  {
    name: "부산",
    slug: "busan",
    region: "경상도",
    budget: "100~200만원",
    environment: "카페작업",
    bestSeason: "여름",
    likes: 142,
    dislikes: 26,
    visual: "from-slate-900 via-cyan-800 to-stone-200",
    mood: "해변 워케이션",
  },
  {
    name: "제주",
    slug: "jeju",
    region: "제주도",
    budget: "100~200만원",
    environment: "자연친화",
    bestSeason: "봄",
    likes: 138,
    dislikes: 29,
    visual: "from-emerald-950 via-teal-800 to-amber-200",
    mood: "자연 집중 환경",
  },
  {
    name: "강릉",
    slug: "gangneung",
    region: "강원도",
    budget: "100~200만원",
    environment: "카페작업",
    bestSeason: "여름",
    likes: 121,
    dislikes: 18,
    visual: "from-blue-950 via-slate-700 to-stone-200",
    mood: "동해안 집중",
  },
  {
    name: "대전",
    slug: "daejeon",
    region: "충청도",
    budget: "100~200만원",
    environment: "도심선호",
    bestSeason: "가을",
    likes: 104,
    dislikes: 21,
    visual: "from-zinc-950 via-indigo-900 to-emerald-200",
    mood: "균형형 거점",
  },
  {
    name: "전주",
    slug: "jeonju",
    region: "전라도",
    budget: "100만원 이하",
    environment: "도심선호",
    bestSeason: "봄",
    likes: 98,
    dislikes: 17,
    visual: "from-stone-950 via-red-950 to-amber-200",
    mood: "문화와 생활비",
  },
  {
    name: "광주",
    slug: "gwangju",
    region: "전라도",
    budget: "100만원 이하",
    environment: "코워킹 필수",
    bestSeason: "겨울",
    likes: 91,
    dislikes: 19,
    visual: "from-neutral-950 via-purple-950 to-yellow-200",
    mood: "문화 기반 도시",
  },
  {
    name: "인천",
    slug: "incheon",
    region: "수도권",
    budget: "100~200만원",
    environment: "도심선호",
    bestSeason: "가을",
    likes: 87,
    dislikes: 24,
    visual: "from-slate-950 via-blue-900 to-amber-200",
    mood: "이동성 중심",
  },
  {
    name: "춘천",
    slug: "chuncheon",
    region: "강원도",
    budget: "100만원 이하",
    environment: "자연친화",
    bestSeason: "봄",
    likes: 82,
    dislikes: 14,
    visual: "from-green-950 via-teal-900 to-sky-200",
    mood: "호수와 집중",
  },
];

export function getCityBySlug(slug: string) {
  return cities.find((city) => city.slug === slug);
}
