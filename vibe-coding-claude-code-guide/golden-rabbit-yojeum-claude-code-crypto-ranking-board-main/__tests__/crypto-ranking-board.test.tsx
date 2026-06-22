import { render, screen } from "@testing-library/react"
import Component from "@/crypto-ranking-board"

describe("crypto ranking board", () => {
  it("renders the ranking table and a representative coin row", () => {
    render(<Component />)

    expect(screen.getAllByRole("columnheader")).toHaveLength(6)
    expect(screen.getByText("BTC")).toBeInTheDocument()
    expect(screen.getByText("ETH")).toBeInTheDocument()
    expect(screen.getByText("$43,250.67")).toBeInTheDocument()
    expect(screen.getByText("$2,580.34")).toBeInTheDocument()
    expect(screen.getByText("+2.45%")).toBeInTheDocument()
    expect(screen.getByText("-1.23%")).toBeInTheDocument()
  })
})
