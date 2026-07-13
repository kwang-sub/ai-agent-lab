"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { VoteType } from "@/types/database";

export type UpdateCityVoteResult = {
  error?: string;
};

export async function updateCityVote(
  citySlug: string,
  nextVote: VoteType,
): Promise<UpdateCityVoteResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "로그인 후 투표할 수 있습니다." };
  }

  const { data: city, error: cityError } = await supabase
    .from("cities")
    .select("id, slug")
    .eq("slug", citySlug)
    .single();

  if (cityError || !city) {
    return { error: "도시를 찾을 수 없습니다." };
  }

  const { data: currentVote, error: currentVoteError } = await supabase
    .from("city_votes")
    .select("id, vote_type")
    .eq("city_id", city.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (currentVoteError) {
    return { error: currentVoteError.message };
  }

  if (currentVote?.vote_type === nextVote) {
    const { error } = await supabase
      .from("city_votes")
      .delete()
      .eq("id", currentVote.id)
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.from("city_votes").upsert(
      {
        city_id: city.id,
        user_id: user.id,
        vote_type: nextVote,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "city_id,user_id" },
    );

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/");
  revalidatePath(`/cities/${city.slug}`);

  return {};
}
