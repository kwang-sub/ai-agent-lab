import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "로그인 | K-NOMAD",
  description: "K-NOMAD 로그인 화면입니다.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <Button asChild variant="ghost" className="mb-6 w-fit px-0 text-muted-foreground hover:bg-transparent">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Link>
        </Button>

        <Card className="border-amber-200/60 bg-card/95 shadow-lg shadow-slate-950/10">
          <CardHeader>
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>
              K-NOMAD 도시 탐색을 이어가려면 계정으로 로그인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  이메일
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  비밀번호
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="비밀번호를 입력하세요"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="button" className="w-full">
                로그인
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              아직 계정이 없나요?{" "}
              <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
                회원가입
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
