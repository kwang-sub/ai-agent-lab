"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ArrowRight,
  Building2,
  Bus,
  Coffee,
  Compass,
  MonitorUp,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthNav } from "@/components/auth-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type City = {
  name: string;
  region: "수도권" | "경상도" | "전라도" | "강원도" | "제주도" | "충청도";
  budget: "100만원 이하" | "100~200만원" | "200만원 이상";
  environment: "자연친화" | "도심선호" | "카페작업" | "코워킹 필수";
  bestSeason: "봄" | "여름" | "가을" | "겨울";
  likes: number;
  dislikes: number;
  visual: string;
  mood: string;
};

type CityFilters = {
  budget: City["budget"] | "전체";
  region: City["region"] | "전체";
  environment: City["environment"] | "전체";
  bestSeason: City["bestSeason"] | "전체";
};

const popularFilters = [
  "100만원 이하",
  "수도권",
  "자연친화",
  "카페작업",
  "봄",
  "가을",
];

const cities: City[] = [
  {
    name: "서울",
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

const criteria = [
  { title: "인터넷", body: "속도와 안정성", icon: MonitorUp },
  { title: "카페/작업공간", body: "노트북 작업성", icon: Coffee },
  { title: "월 생활비", body: "숙소와 식비", icon: WalletCards },
  { title: "교통", body: "이동 편의성", icon: Bus },
  { title: "안전", body: "체감 안전도", icon: ShieldCheck },
  { title: "재미", body: "놀거리/문화", icon: Sparkles },
  { title: "조용함", body: "집중 환경", icon: Volume2 },
  { title: "커뮤니티", body: "사람 만나기", icon: Users },
  { title: "재방문 의향", body: "다시 살고 싶은지", icon: Compass },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <CityExplorer />
      <Criteria />
      <ShareExperience />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-amber-200/30 bg-[oklch(0.18_0.016_255_/_0.92)] text-primary-foreground shadow-lg shadow-slate-950/10 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-normal">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-amber-200/50 bg-secondary text-sm text-secondary-foreground shadow-sm shadow-amber-900/20">
            K
          </span>
          <span>K-NOMAD</span>
        </Link>
        <nav className="flex items-center gap-2">
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="border-b border-amber-200/40 bg-[linear-gradient(135deg,oklch(0.18_0.016_255),oklch(0.29_0.02_255)_58%,oklch(0.88_0.062_87))] text-primary-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_22rem] lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-5 border-amber-200/40 bg-secondary/90">
            한국 워케이션 도시 비교
          </Badge>
          <h1 className="text-4xl font-semibold leading-tight tracking-normal text-primary-foreground sm:text-5xl">
            대한민국에서 노마드로 살기 좋은 도시를 찾아보세요
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80 sm:text-lg">
            예산, 지역, 작업 환경, 계절 조건으로 비교하는 한국 워케이션 도시 리스트
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="도시 검색"
                className="border-amber-200/50 bg-white/95 pl-10 text-foreground"
                placeholder="서울, 부산, 제주, 강릉 검색..."
              />
            </div>
            <Button size="lg" className="sm:min-w-36">
              도시 찾기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-7">
            <p className="mb-3 text-sm font-medium text-primary-foreground/70">인기 필터</p>
            <div className="flex flex-wrap gap-2">
              {popularFilters.map((filter) => (
                <Button
                  key={filter}
                  variant="outline"
                  size="sm"
                  className="border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-3 self-end rounded-lg border border-amber-200/35 bg-primary-foreground/95 p-4 text-foreground shadow-2xl shadow-slate-950/25">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="h-4 w-4 text-primary" />
            이번 주 탐색 지표
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Metric value="9" label="도시" />
            <Metric value="1,019" label="좋아요" />
            <Metric value="3" label="예산군" />
          </div>
          <Separator />
          <p className="text-sm leading-6 text-muted-foreground">
            예산, 지역, 환경, 최고 계절을 한 화면에서 비교하는 탐색형 홈입니다.
          </p>
        </div>
      </div>
    </section>
  );
}

function CityExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<CityFilters>({
    budget: "전체",
    region: "전체",
    environment: "전체",
    bestSeason: "전체",
  });

  const filteredCities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return cities
      .filter((city) => {
        const matchesSearch =
          !query ||
          city.name.toLowerCase().includes(query) ||
          city.region.toLowerCase().includes(query) ||
          city.environment.toLowerCase().includes(query) ||
          city.bestSeason.toLowerCase().includes(query);
        const matchesBudget = filters.budget === "전체" || city.budget === filters.budget;
        const matchesRegion = filters.region === "전체" || city.region === filters.region;
        const matchesEnvironment =
          filters.environment === "전체" || city.environment === filters.environment;
        const matchesSeason =
          filters.bestSeason === "전체" || city.bestSeason === filters.bestSeason;

        return (
          matchesSearch &&
          matchesBudget &&
          matchesRegion &&
          matchesEnvironment &&
          matchesSeason
        );
      })
      .sort((a, b) => b.likes - a.likes);
  }, [filters, searchQuery]);

  const hasActiveFilter =
    searchQuery.trim() ||
    filters.budget !== "전체" ||
    filters.region !== "전체" ||
    filters.environment !== "전체" ||
    filters.bestSeason !== "전체";

  function updateFilter<Key extends keyof CityFilters>(
    key: Key,
    value: CityFilters[Key],
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetFilters() {
    setSearchQuery("");
    setFilters({
      budget: "전체",
      region: "전체",
      environment: "전체",
      bestSeason: "전체",
    });
  }

  return (
    <Section
      eyebrow="Cities"
      title="도시 리스트"
      description="선택한 조건에 맞는 도시를 좋아요 수가 높은 순서대로 표시합니다."
    >
      <div className="mb-5 grid gap-3 rounded-lg border bg-card/90 p-3 shadow-sm shadow-slate-950/5 sm:grid-cols-2 lg:grid-cols-5">
        <label className="grid gap-2 text-sm font-medium sm:col-span-2 lg:col-span-1">
          도시 검색
          <Input
            aria-label="도시 리스트 검색"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="도시, 지역, 환경 검색"
          />
        </label>
        <FilterSelect
          label="예산"
          value={filters.budget}
          items={["전체", "100만원 이하", "100~200만원", "200만원 이상"]}
          onValueChange={(value) => updateFilter("budget", value as CityFilters["budget"])}
        />
        <FilterSelect
          label="지역"
          value={filters.region}
          items={["전체", "수도권", "경상도", "전라도", "강원도", "제주도", "충청도"]}
          onValueChange={(value) => updateFilter("region", value as CityFilters["region"])}
        />
        <FilterSelect
          label="환경"
          value={filters.environment}
          items={["전체", "자연친화", "도심선호", "카페작업", "코워킹 필수"]}
          onValueChange={(value) =>
            updateFilter("environment", value as CityFilters["environment"])
          }
        />
        <FilterSelect
          label="최고 계절"
          value={filters.bestSeason}
          items={["전체", "봄", "여름", "가을", "겨울"]}
          onValueChange={(value) =>
            updateFilter("bestSeason", value as CityFilters["bestSeason"])
          }
        />
        <div className="flex items-end justify-between gap-3 sm:col-span-2 lg:col-span-5">
          <p className="text-sm text-muted-foreground">
            {filteredCities.length}개 도시 표시
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!hasActiveFilter}
            onClick={resetFilters}
          >
            필터 초기화
          </Button>
        </div>
      </div>
      {filteredCities.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCities.map((city) => (
            <CityCard key={city.name} city={city} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card/90 px-4 py-10 text-center text-muted-foreground">
          조건에 맞는 도시가 없습니다.
        </div>
      )}
    </Section>
  );
}

function Criteria() {
  return (
    <Section
      eyebrow="Criteria"
      title="사람들이 비교하는 기준"
      description="도시 정보는 원격근무자의 실제 생활 조건을 중심으로 해석합니다."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {criteria.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-lg border bg-card/95 p-4 shadow-sm shadow-slate-950/5">
              <Icon className="mb-4 h-5 w-5 text-primary" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ShareExperience() {
  return (
    <section className="px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-lg border border-amber-200/30 bg-[linear-gradient(135deg,oklch(0.18_0.016_255),oklch(0.29_0.02_255)_62%,oklch(0.78_0.078_86))] px-5 py-10 text-primary-foreground shadow-2xl shadow-slate-950/15 sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
        <div>
          <p className="text-sm font-medium opacity-80">도시 데이터에 참여하기</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">
            당신의 도시 경험을 공유해주세요
          </h2>
          <p className="mt-3 max-w-2xl leading-7 opacity-85">
            한 달 살아본 도시, 워케이션으로 머문 도시, 원격근무하기 좋았던 곳을 평가하세요
          </p>
        </div>
      </div>
    </section>
  );
}

function CityCard({ city }: { city: City }) {
  return (
    <Card className="overflow-hidden border-amber-200/50 shadow-lg shadow-slate-950/8">
      <div className={cn("relative h-36 bg-gradient-to-br", city.visual)}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.13)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.13)_50%,rgba(255,255,255,.13)_75%,transparent_75%,transparent)] bg-[length:28px_28px] opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs font-medium opacity-80">{city.mood}</p>
          <p className="text-2xl font-semibold tracking-normal">{city.name}</p>
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{city.name}</CardTitle>
            <CardDescription>{city.region}</CardDescription>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-primary">{city.likes.toLocaleString()} 좋아요</p>
            <p className="text-muted-foreground">{city.dislikes.toLocaleString()} 싫어요</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm">
          <InfoRow label="예산" value={city.budget} />
          <InfoRow label="지역" value={city.region} />
          <InfoRow label="환경" value={city.environment} />
          <InfoRow label="최고 계절" value={city.bestSeason} />
        </dl>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border bg-muted/45 px-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  items,
  onValueChange,
}: {
  label: string;
  value: string;
  items: string[];
  onValueChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-amber-200/40 bg-muted/85 p-3">
      <p className="text-lg font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
