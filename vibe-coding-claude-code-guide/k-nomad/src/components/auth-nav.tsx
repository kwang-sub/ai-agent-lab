"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase";

function getDisplayName(user: User) {
  const metadataName = user.user_metadata.name;

  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  return user.email ?? "사용자";
}

export function AuthNav() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (isLoading) {
    return (
      <span className="hidden min-w-16 text-right text-sm text-primary-foreground/70 sm:inline">
        확인 중
      </span>
    );
  }

  if (user) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <span className="max-w-44 truncate text-sm font-medium text-primary-foreground">
          {getDisplayName(user)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isSigningOut}
          onClick={async () => {
            setIsSigningOut(true);
            await supabase.auth.signOut();
            setUser(null);
            setIsSigningOut(false);
            router.refresh();
          }}
          aria-label="로그아웃"
        >
          <LogOut className="h-4 w-4" />
          {isSigningOut ? "처리 중" : "로그아웃"}
        </Button>
      </div>
    );
  }

  return (
    <Button asChild variant="ghost" className="hidden sm:inline-flex">
      <Link href="/login">로그인</Link>
    </Button>
  );
}
