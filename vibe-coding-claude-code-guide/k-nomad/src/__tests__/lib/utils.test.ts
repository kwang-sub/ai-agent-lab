import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names and removes falsey values", () => {
    const shouldHide = false;

    expect(cn("flex", shouldHide && "hidden", null, undefined, "items-center")).toBe(
      "flex items-center",
    );
  });

  it("resolves Tailwind class conflicts with the last value", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
