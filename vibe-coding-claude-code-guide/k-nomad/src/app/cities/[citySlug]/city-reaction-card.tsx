"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type VoteState = "like" | "dislike" | null;

type CityReactionCardProps = {
  initialLikes: number;
  initialDislikes: number;
};

export function CityReactionCard({
  initialLikes,
  initialDislikes,
}: CityReactionCardProps) {
  const [selected, setSelected] = useState<VoteState>(null);

  const likes = initialLikes + (selected === "like" ? 1 : 0);
  const dislikes = initialDislikes + (selected === "dislike" ? 1 : 0);

  function updateVote(nextVote: Exclude<VoteState, null>) {
    setSelected((current) => (current === nextVote ? null : nextVote));
  }

  return (
    <Card className="border-amber-200/50 shadow-lg shadow-slate-950/8">
      <CardHeader>
        <CardTitle>추천 반응</CardTitle>
        <CardDescription>mock 데이터 기준으로 현재 선택만 반영합니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant={selected === "like" ? "default" : "outline"}
          aria-pressed={selected === "like"}
          onClick={() => updateVote("like")}
          className={cn(
            "h-auto flex-col items-start justify-start p-4 text-left",
            selected === "like" &&
              "bg-emerald-600 text-white hover:bg-emerald-700",
          )}
        >
          <ThumbsUp className="h-5 w-5" />
          <span className="text-2xl font-semibold">{likes.toLocaleString()}</span>
          <span className="text-sm">좋아요</span>
        </Button>
        <Button
          type="button"
          variant={selected === "dislike" ? "default" : "outline"}
          aria-pressed={selected === "dislike"}
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
      </CardContent>
    </Card>
  );
}
