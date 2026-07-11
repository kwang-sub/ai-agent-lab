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

import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "회원가입 | K-NOMAD",
  description: "K-NOMAD 회원가입 화면입니다.",
};

export default function RegisterPage() {
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
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>
              한국 디지털 노마드 도시 탐색을 위한 계정을 준비하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
