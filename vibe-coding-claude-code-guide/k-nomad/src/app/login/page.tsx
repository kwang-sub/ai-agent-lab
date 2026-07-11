import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "./login-form";

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
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
