import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { VoteType } from "@/types/database";

export type CityRegion =
  | "수도권"
  | "경상도"
  | "전라도"
  | "강원도"
  | "제주도"
  | "충청도";

export type CityBudget = "100만원 이하" | "100~200만원" | "200만원 이상";

export type CityEnvironment =
  | "자연친화"
  | "도심선호"
  | "카페작업"
  | "코워킹 필수";

export type CitySeason = "봄" | "여름" | "가을" | "겨울";

export type CityVoteState = VoteType | null;

export type City = {
  id: string;
  name: string;
  slug: string;
  region: CityRegion;
  budget: CityBudget;
  environment: CityEnvironment;
  bestSeason: CitySeason;
  likes: number;
  dislikes: number;
  userVote: CityVoteState;
  visual: string;
  mood: string;
};

type CityRow = {
  id: string;
  name: string;
  slug: string;
  region: string;
  budget: string;
  environment: string;
  best_season: string;
  visual: string;
  mood: string;
  likes: number;
  dislikes: number;
  user_vote: VoteType | null;
};

function mapCity(row: CityRow): City {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    region: row.region as CityRegion,
    budget: row.budget as CityBudget,
    environment: row.environment as CityEnvironment,
    bestSeason: row.best_season as CitySeason,
    likes: row.likes,
    dislikes: row.dislikes,
    userVote: row.user_vote,
    visual: row.visual,
    mood: row.mood,
  };
}

export async function getCities() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_cities_with_votes");

  if (error) {
    throw new Error(`도시 데이터를 불러오지 못했습니다: ${error.message}`);
  }

  return (data ?? []).map(mapCity).sort((a, b) => b.likes - a.likes);
}

export async function getCityBySlug(slug: string) {
  const cities = await getCities();

  return cities.find((city) => city.slug === slug);
}
