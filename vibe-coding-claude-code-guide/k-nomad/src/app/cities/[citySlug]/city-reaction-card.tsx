"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { updateCityVote } from "@/app/actions/city-votes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CityVoteState } from "@/lib/cities";
import { cn } from "@/lib/utils";
import type { VoteType } from "@/types/database";

type CityReactionCardProps = {
  citySlug: string;
  initialLikes: number;
  initialDislikes: number;
  initialVote: CityVoteState;
  isAuthenticated: boolean;
};

export function CityReactionCard({
  citySlug,
  initialLikes,
  initialDislikes,
  initialVote,
  isAuthenticated,
}: CityReactionCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<CityVoteState>(initialVote);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const likes =
    initialLikes +
    (initialVote !== "like" && selected === "like" ? 1 : 0) -
    (initialVote === "like" && selected !== "like" ? 1 : 0);
  const dislikes =
    initialDislikes +
    (initialVote !== "dislike" && selected === "dislike" ? 1 : 0) -
    (initialVote === "dislike" && selected !== "dislike" ? 1 : 0);

  function updateVote(nextVote: VoteType) {
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage("로그인 후 투표할 수 있습니다.");
      router.push("/login");
      return;
    }

    setSelected((current) => (current === nextVote ? null : nextVote));

    startTransition(async () => {
      const result = await updateCityVote(citySlug, nextVote);

      if (result.error) {
        setErrorMessage(result.error);
      }

      router.refresh();
    });
  }

  return (
    <Card className="border-amber-200/50 shadow-lg shadow-slate-950/8">
      <CardHeader>
        <CardTitle>추천 반응</CardTitle>
        <CardDescription>
          로그인한 사용자는 도시별로 하나의 반응을 남길 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {errorMessage ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={selected === "like" ? "default" : "outline"}
            aria-pressed={selected === "like"}
            disabled={isPending}
            onClick={() => updateVote("like")}
            className={cn(
              "h-auto flex-col items-start justify-start p-4 text-left",
              selected === "like" &&
                "bg-emerald-600 text-white hover:bg-emerald-700",
            )}
          >
            <ThumbsUp className="h-5 w-5" />
            <span className="text-2xl font-semibold">
              {likes.toLocaleString()}
            </span>
            <span className="text-sm">좋아요</span>
          </Button>
          <Button
            type="button"
            variant={selected === "dislike" ? "default" : "outline"}
            aria-pressed={selected === "dislike"}
            disabled={isPending}
            onClick={() => updateVote("dislike")}
            className={cn(
              "h-auto flex-col items-start justify-start p-4 text-left",
              selected === "dislike" &&
                "bg-rose-600 text-white hover:bg-rose-700",
            )}
          >
            <ThumbsDown className="h-5 w-5" />
            <span className="text-2xl font-semibold">
              {dislikes.toLocaleString()}
            </span>
            <span className="text-sm">싫어요</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
