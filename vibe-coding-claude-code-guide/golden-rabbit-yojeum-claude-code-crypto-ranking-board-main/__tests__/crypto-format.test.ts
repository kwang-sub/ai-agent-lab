import { formatNumber, formatPrice } from "@/lib/crypto-format"

describe("crypto format helpers", () => {
  it("formats market values using compact suffixes", () => {
    expect(formatNumber(999)).toBe("$999.00")
    expect(formatNumber(1_250)).toBe("$1.25K")
    expect(formatNumber(2_500_000)).toBe("$2.50M")
    expect(formatNumber(3_400_000_000)).toBe("$3.40B")
    expect(formatNumber(4_500_000_000_000)).toBe("$4.50T")
  })

  it("formats prices with the right precision", () => {
    expect(formatPrice(2580.34)).toBe("$2,580.34")
    expect(formatPrice(1)).toBe("$1.00")
    expect(formatPrice(0.6234)).toBe("$0.6234")
  })
})
