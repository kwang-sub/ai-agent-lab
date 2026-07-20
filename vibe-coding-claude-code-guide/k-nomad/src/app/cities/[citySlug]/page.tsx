import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  WalletCards,
  Workflow,
} from "lucide-react";

import { AuthNav } from "@/components/auth-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCityBySlug } from "@/lib/cities";
import { isUsingE2ECityFixtures } from "@/lib/e2e-cities";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { CityReactionCard } from "./city-reaction-card";

type CityDetailPageProps = {
  params: Promise<{
    citySlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CityDetailPageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    return {
      title: "도시를 찾을 수 없습니다 | K-NOMAD",
    };
  }

  return {
    title: `${city.name} 상세 정보 | K-NOMAD`,
    description: `${city.name}의 예산, 지역, 환경, 최고 계절 정보를 확인하세요.`,
  };
}

export default async function CityDetailPage({ params }: CityDetailPageProps) {
  const { citySlug } = await params;
  const [city, user] = await Promise.all([
    getCityBySlug(citySlug),
    isUsingE2ECityFixtures()
      ? Promise.resolve(null)
      : createSupabaseServerClient().then(async (supabase) => {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          return user;
        }),
  ]);

  if (!city) {
    notFound();
  }

  const details = [
    { label: "예산", value: city.budget, icon: WalletCards },
    { label: "지역", value: city.region, icon: MapPin },
    { label: "환경", value: city.environment, icon: Workflow },
    { label: "최고 계절", value: city.bestSeason, icon: CalendarDays },
  ];

  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Button asChild variant="ghost" className="mb-5 px-0 hover:bg-transparent">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              도시 리스트
            </Link>
          </Button>
          <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
            <div className="overflow-hidden rounded-lg border border-amber-200/50 bg-card shadow-xl shadow-slate-950/10">
              <div className={cn("relative min-h-80 bg-gradient-to-br", city.visual)}>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.13)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.13)_50%,rgba(255,255,255,.13)_75%,transparent_75%,transparent)] bg-[length:36px_36px] opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-8">
                  <Badge variant="secondary" className="mb-4 border-amber-200/40">
                    {city.region}
                  </Badge>
                  <p className="text-sm font-medium opacity-80">{city.mood}</p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-normal sm:text-5xl">
                    {city.name}
                  </h1>
                </div>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
                {details.map((detail) => {
                  const Icon = detail.icon;

                  return (
                    <div
                      key={detail.label}
                      className="rounded-lg border bg-muted/45 p-4"
                    >
                      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon className="h-4 w-4 text-primary" />
                        {detail.label}
                      </div>
                      <p className="text-lg font-semibold">{detail.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <aside className="grid gap-4 self-start">
              <CityReactionCard
                citySlug={city.slug}
                initialLikes={city.likes}
                initialDislikes={city.dislikes}
                initialVote={city.userVote}
                isAuthenticated={Boolean(user)}
              />
              <Card className="border-amber-200/50 shadow-lg shadow-slate-950/8">
                <CardHeader>
                  <CardTitle>도시 요약</CardTitle>
                  <CardDescription>{city.name} 워케이션 조건</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-3 text-sm">
                    <InfoRow label="분위기" value={city.mood} />
                    <InfoRow label="예산" value={city.budget} />
                    <InfoRow label="환경" value={city.environment} />
                    <InfoRow label="추천 계절" value={city.bestSeason} />
                  </dl>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border bg-muted/45 px-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
