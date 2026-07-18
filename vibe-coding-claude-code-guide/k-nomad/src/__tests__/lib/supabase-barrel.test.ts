import { describe, expect, it } from "vitest";

import * as supabase from "@/lib/supabase";

describe("supabase barrel exports", () => {
  it("exposes browser client helpers", () => {
    expect(supabase.createSupabaseBrowserClient).toBeTypeOf("function");
    expect(supabase.getSupabaseConfig).toBeTypeOf("function");
  });
});
