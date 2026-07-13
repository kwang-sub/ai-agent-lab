"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ThumbsDown, ThumbsUp } from "lucide-react";

import { updateCityVote } from "@/app/actions/city-votes";
import { Button } from "@/components/ui/button";
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
import type { City, CityVoteState } from "@/lib/cities";
import { cn } from "@/lib/utils";
import type { VoteType } from "@/types/database";

type CityFilters = {
  budget: City["budget"] | "전체";
  region: City["region"] | "전체";
  environment: City["environment"] | "전체";
  bestSeason: City["bestSeason"] | "전체";
};

type CityExplorerProps = {
  cities: City[];
  isAuthenticated: boolean;
};

export function CityExplorer({
  cities,
  isAuthenticated,
}: CityExplorerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<CityFilters>({
    budget: "전체",
    region: "전체",
    environment: "전체",
    bestSeason: "전체",
  });
  const [cityVotes, setCityVotes] = useState<Record<string, CityVoteState>>(
    () =>
      Object.fromEntries(cities.map((city) => [city.slug, city.userVote])),
  );

  useEffect(() => {
    setCityVotes(
      Object.fromEntries(cities.map((city) => [city.slug, city.userVote])),
    );
  }, [cities]);

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
        const matchesBudget =
          filters.budget === "전체" || city.budget === filters.budget;
        const matchesRegion =
          filters.region === "전체" || city.region === filters.region;
        const matchesEnvironment =
          filters.environment === "전체" ||
          city.environment === filters.environment;
        const matchesSeason =
          filters.bestSeason === "전체" ||
          city.bestSeason === filters.bestSeason;

        return (
          matchesSearch &&
          matchesBudget &&
          matchesRegion &&
          matchesEnvironment &&
          matchesSeason
        );
      })
      .sort((a, b) => b.likes - a.likes);
  }, [cities, filters, searchQuery]);

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

  function updateVote(city: City, nextVote: VoteType) {
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage("로그인 후 투표할 수 있습니다.");
      router.push("/login");
      return;
    }

    setCityVotes((current) => ({
      ...current,
      [city.slug]: current[city.slug] === nextVote ? null : nextVote,
    }));

    startTransition(async () => {
      const result = await updateCityVote(city.slug, nextVote);

      if (result.error) {
        setErrorMessage(result.error);
      }

      router.refresh();
    });
  }

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Cities
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">
            도시 리스트
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            선택한 조건에 맞는 도시를 좋아요 수가 높은 순서대로 표시합니다.
          </p>
        </div>
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
            onValueChange={(value) =>
              updateFilter("budget", value as CityFilters["budget"])
            }
          />
          <FilterSelect
            label="지역"
            value={filters.region}
            items={[
              "전체",
              "수도권",
              "경상도",
              "전라도",
              "강원도",
              "제주도",
              "충청도",
            ]}
            onValueChange={(value) =>
              updateFilter("region", value as CityFilters["region"])
            }
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
        {errorMessage ? (
          <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
        {filteredCities.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCities.map((city) => (
              <CityCard
                key={city.slug}
                city={city}
                selectedVote={cityVotes[city.slug] ?? null}
                isPending={isPending}
                onVote={(nextVote) => updateVote(city, nextVote)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card/90 px-4 py-10 text-center text-muted-foreground">
            조건에 맞는 도시가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}

function CityCard({
  city,
  selectedVote,
  isPending,
  onVote,
}: {
  city: City;
  selectedVote: CityVoteState;
  isPending: boolean;
  onVote: (nextVote: VoteType) => void;
}) {
  const likes =
    city.likes +
    (city.userVote !== "like" && selectedVote === "like" ? 1 : 0) -
    (city.userVote === "like" && selectedVote !== "like" ? 1 : 0);
  const dislikes =
    city.dislikes +
    (city.userVote !== "dislike" && selectedVote === "dislike" ? 1 : 0) -
    (city.userVote === "dislike" && selectedVote !== "dislike" ? 1 : 0);

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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-3 text-sm">
          <InfoRow label="예산" value={city.budget} />
          <InfoRow label="지역" value={city.region} />
          <InfoRow label="환경" value={city.environment} />
          <InfoRow label="최고 계절" value={city.bestSeason} />
        </dl>
        <Button asChild variant="secondary" className="w-full justify-center">
          <Link href={`/cities/${city.slug}`}>
            상세 정보
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={selectedVote === "like" ? "default" : "outline"}
            aria-pressed={selectedVote === "like"}
            disabled={isPending}
            onClick={() => onVote("like")}
            className={cn(
              "justify-center",
              selectedVote === "like" &&
                "bg-emerald-600 text-white hover:bg-emerald-700",
            )}
          >
            <ThumbsUp className="h-4 w-4" />
            {likes.toLocaleString()}
          </Button>
          <Button
            type="button"
            variant={selectedVote === "dislike" ? "default" : "outline"}
            aria-pressed={selectedVote === "dislike"}
            disabled={isPending}
            onClick={() => onVote("dislike")}
            className={cn(
              "justify-center",
              selectedVote === "dislike" &&
                "bg-rose-600 text-white hover:bg-rose-700",
            )}
          >
            <ThumbsDown className="h-4 w-4" />
            {dislikes.toLocaleString()}
          </Button>
        </div>
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
