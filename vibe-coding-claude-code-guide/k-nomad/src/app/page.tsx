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
  Star,
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
  region: string;
  rating: string;
  cost: string;
  scores: string[];
  tags: string[];
  visual: string;
  mood: string;
};

const popularFilters = [
  "가성비 좋은",
  "카페 많은",
  "바다 근처",
  "조용한",
  "교통 편리",
  "한달살기 추천",
];

const cities: City[] = [
  {
    name: "서울",
    region: "수도권",
    rating: "4.3",
    cost: "₩2,200,000 / mo",
    scores: ["카페 5", "인터넷 5", "교통 5"],
    tags: ["대도시", "교통", "커뮤니티"],
    visual: "from-slate-950 via-slate-700 to-amber-300",
    mood: "초연결 대도시",
  },
  {
    name: "부산",
    region: "경상권",
    rating: "4.1",
    cost: "₩1,700,000 / mo",
    scores: ["바다 5", "카페 4", "재미 4"],
    tags: ["바다", "장기체류", "문화"],
    visual: "from-slate-900 via-cyan-800 to-stone-200",
    mood: "해변 워케이션",
  },
  {
    name: "제주",
    region: "제주권",
    rating: "4.0",
    cost: "₩1,900,000 / mo",
    scores: ["자연 5", "조용함 4", "카페 4"],
    tags: ["자연", "한달살기", "휴식"],
    visual: "from-emerald-950 via-teal-800 to-amber-200",
    mood: "자연 집중 환경",
  },
  {
    name: "강릉",
    region: "강원권",
    rating: "3.9",
    cost: "₩1,500,000 / mo",
    scores: ["인터넷 4", "조용함 5", "바다 5"],
    tags: ["바다", "조용함", "카페"],
    visual: "from-blue-950 via-slate-700 to-stone-200",
    mood: "동해안 집중",
  },
  {
    name: "대전",
    region: "충청권",
    rating: "3.8",
    cost: "₩1,400,000 / mo",
    scores: ["교통 4", "비용 4", "인터넷 4"],
    tags: ["중심지", "가성비", "교통"],
    visual: "from-zinc-950 via-indigo-900 to-emerald-200",
    mood: "균형형 거점",
  },
  {
    name: "전주",
    region: "전라권",
    rating: "3.7",
    cost: "₩1,300,000 / mo",
    scores: ["비용 5", "음식 5", "조용함 4"],
    tags: ["문화", "가성비", "음식"],
    visual: "from-stone-950 via-red-950 to-amber-200",
    mood: "문화와 생활비",
  },
  {
    name: "광주",
    region: "전라권",
    rating: "3.7",
    cost: "₩1,350,000 / mo",
    scores: ["비용 4", "문화 4", "교통 3"],
    tags: ["문화", "가성비", "커뮤니티"],
    visual: "from-neutral-950 via-purple-950 to-yellow-200",
    mood: "문화 기반 도시",
  },
  {
    name: "인천",
    region: "수도권",
    rating: "3.6",
    cost: "₩1,600,000 / mo",
    scores: ["교통 4", "공항 5", "비용 3"],
    tags: ["공항", "수도권", "바다"],
    visual: "from-slate-950 via-blue-900 to-amber-200",
    mood: "이동성 중심",
  },
  {
    name: "춘천",
    region: "강원권",
    rating: "3.6",
    cost: "₩1,250,000 / mo",
    scores: ["조용함 5", "자연 5", "비용 4"],
    tags: ["호수", "조용함", "가성비"],
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

const reviews = [
  {
    city: "부산",
    rating: "4.5",
    text: "해운대 쪽은 비싸지만 광안리 주변은 작업하기 좋은 카페가 많았어요.",
    meta: "2개월 체류 · 프리랜서 디자이너",
  },
  {
    city: "강릉",
    rating: "4.2",
    text: "조용하고 바다가 가까워서 좋지만 늦은 밤 교통은 조금 불편했습니다.",
    meta: "1개월 체류 · 개발자",
  },
  {
    city: "대전",
    rating: "4.0",
    text: "서울과 부산을 오가기 편해서 미팅이 있는 원격근무자에게 실용적이었습니다.",
    meta: "6주 체류 · 콘텐츠 마케터",
  },
];

const rankingCities = cities.slice(0, 3);

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Ranking />
      <CityExplorer />
      <Criteria />
      <Reviews />
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
            실제 사용자 평가로 보는 비용, 카페, 인터넷, 교통, 안전, 생활 만족도
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
            <Metric value="42" label="평가" />
            <Metric value="₩1.6M" label="중간 비용" />
          </div>
          <Separator />
          <p className="text-sm leading-6 text-muted-foreground">
            비용, 작업환경, 이동성, 체류 만족도를 한 화면에서 비교하는 탐색형 홈입니다.
          </p>
        </div>
      </div>
    </section>
  );
}

function Ranking() {
  return (
    <Section
      eyebrow="Top 3"
      title="오늘의 노마드 랭킹"
      description="평점과 작업 환경, 체류 비용을 함께 본 인기 도시입니다."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {rankingCities.map((city, index) => (
          <CityCard key={city.name} city={city} rank={index + 1} featured />
        ))}
      </div>
    </Section>
  );
}

function CityExplorer() {
  return (
    <Section
      eyebrow="Explore"
      title="도시 탐색"
      description="정렬과 조건을 바꿔볼 수 있는 UI입니다. 이번 MVP에서는 결과 변경 로직은 포함하지 않습니다."
    >
      <div className="mb-5 grid gap-3 rounded-lg border bg-card/90 p-3 shadow-sm shadow-slate-950/5 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect label="정렬" value="nomad-score" items={["노마드 점수순", "비용 낮은순", "인터넷 좋은순", "카페 많은순"]} />
        <FilterSelect label="지역" value="all-region" items={["전체", "수도권", "강원권", "충청권", "전라권", "경상권", "제주권"]} />
        <FilterSelect label="비용" value="all-cost" items={["전체", "150만원 이하", "150~180만원", "180만원 이상"]} />
        <FilterSelect label="분위기" value="all-mood" items={["전체", "조용한", "바다 근처", "대도시", "문화 많은"]} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <CityCard key={city.name} city={city} />
        ))}
      </div>
    </Section>
  );
}

function Criteria() {
  return (
    <Section
      eyebrow="Score"
      title="사람들이 평가하는 기준"
      description="노마드 점수는 원격근무자의 실제 생활 조건을 중심으로 해석합니다."
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

function Reviews() {
  return (
    <Section
      eyebrow="Reviews"
      title="최근 리뷰"
      description="장기 체류와 워케이션 경험에서 나온 짧은 평가입니다."
    >
      <div className="grid gap-3">
        {reviews.map((review) => (
          <Card key={`${review.city}-${review.meta}`}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">{review.city}</CardTitle>
                <Rating value={review.rating} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="leading-7">{review.text}</p>
              <p className="mt-3 text-sm text-muted-foreground">{review.meta}</p>
            </CardContent>
          </Card>
        ))}
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

function CityCard({
  city,
  rank,
  featured = false,
}: {
  city: City;
  rank?: number;
  featured?: boolean;
}) {
  return (
    <Card className="overflow-hidden border-amber-200/50 shadow-lg shadow-slate-950/8">
      <div className={cn("relative h-36 bg-gradient-to-br", city.visual)}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.13)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.13)_50%,rgba(255,255,255,.13)_75%,transparent_75%,transparent)] bg-[length:28px_28px] opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        {rank ? (
          <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-amber-200/60 bg-background/95 text-sm font-semibold text-foreground shadow-sm">
            {rank}
          </div>
        ) : null}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="text-xs font-medium opacity-80">{city.mood}</p>
            <p className="text-2xl font-semibold tracking-normal">{city.name}</p>
          </div>
          <Rating value={city.rating} inverse />
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{city.name}</CardTitle>
            <CardDescription>{city.region}</CardDescription>
          </div>
          {!featured ? <Rating value={city.rating} /> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base font-semibold">{city.cost}</p>
        <div className="flex flex-wrap gap-2">
          {city.scores.map((score) => (
            <Badge key={score} variant="muted">
              {score}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {city.tags.map((tag) => (
            <span key={tag} className="text-sm text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  items,
}: {
  label: string;
  value: string;
  items: string[];
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <Select defaultValue={value}>
        <SelectTrigger aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item, index) => (
            <SelectItem key={item} value={index === 0 ? value : item}>
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

function Rating({ value, inverse = false }: { value: string; inverse?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold",
        inverse
          ? "border border-white/20 bg-black/35 text-white"
          : "border border-amber-200/60 bg-secondary text-secondary-foreground",
      )}
    >
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      {value}
    </span>
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
