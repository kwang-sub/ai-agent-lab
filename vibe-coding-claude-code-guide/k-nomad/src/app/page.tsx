import Link from "next/link";
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

import { CityExplorer } from "@/app/city-explorer";
import { AuthNav } from "@/components/auth-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getCities } from "@/lib/cities";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const popularFilters = [
  "100만원 이하",
  "수도권",
  "자연친화",
  "카페작업",
  "봄",
  "가을",
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

export default async function Home() {
  const [cities, supabase] = await Promise.all([
    getCities(),
    createSupabaseServerClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen">
      <Header />
      <Hero
        cityCount={cities.length}
        likeCount={cities.reduce((sum, city) => sum + city.likes, 0)}
      />
      <CityExplorer cities={cities} isAuthenticated={Boolean(user)} />
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

function Hero({
  cityCount,
  likeCount,
}: {
  cityCount: number;
  likeCount: number;
}) {
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
            <Metric value={cityCount.toLocaleString()} label="도시" />
            <Metric value={likeCount.toLocaleString()} label="좋아요" />
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
            <div
              key={item.title}
              className="rounded-lg border bg-card/95 p-4 shadow-sm shadow-slate-950/5"
            >
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
