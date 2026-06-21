import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CoinData {
  rank: number
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  volume: number
  logo: string
}

const mockCoinData: CoinData[] = [
  {
    rank: 1,
    name: "비트코인",
    symbol: "BTC",
    price: 43250.67,
    change24h: 2.45,
    marketCap: 847500000000,
    volume: 28500000000,
    logo: "/coin/bitcoin.png",
  },
  {
    rank: 2,
    name: "이더리움",
    symbol: "ETH",
    price: 2580.34,
    change24h: -1.23,
    marketCap: 310200000000,
    volume: 15200000000,
    logo: "/coin/ethereum.png",
  },
  {
    rank: 3,
    name: "테더",
    symbol: "USDT",
    price: 1.0,
    change24h: 0.02,
    marketCap: 95800000000,
    volume: 42100000000,
    logo: "/coin/tether.png",
  },
  {
    rank: 4,
    name: "바이낸스 코인",
    symbol: "BNB",
    price: 315.78,
    change24h: 3.67,
    marketCap: 47300000000,
    volume: 1800000000,
    logo: "/coin/bnb.png",
  },
  {
    rank: 5,
    name: "솔라나",
    symbol: "SOL",
    price: 98.45,
    change24h: 5.23,
    marketCap: 43900000000,
    volume: 2100000000,
    logo: "/coin/solana.png",
  },
  {
    rank: 6,
    name: "리플",
    symbol: "XRP",
    price: 0.6234,
    change24h: -2.87,
    marketCap: 35200000000,
    volume: 1500000000,
    logo: "/coin/xrp.png",
  },
  {
    rank: 7,
    name: "USD 코인",
    symbol: "USDC",
    price: 1.0,
    change24h: -0.01,
    marketCap: 32100000000,
    volume: 5800000000,
    logo: "/coin/usdc.webp",
  },
  {
    rank: 8,
    name: "카르다노",
    symbol: "ADA",
    price: 0.4567,
    change24h: 1.89,
    marketCap: 16200000000,
    volume: 890000000,
    logo: "/coin/cardano.png",
  },
]

function formatNumber(num: number): string {
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`
  }
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`
  }
  if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`
  }
  return `$${num.toFixed(2)}`
}

function formatPrice(price: number): string {
  if (price >= 1) {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `$${price.toFixed(4)}`
}

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-black">₿</span>
              </div>
              암호화폐 순위
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/50">
                    <th className="text-left p-4 text-gray-400 font-medium">순위</th>
                    <th className="text-left p-4 text-gray-400 font-medium">이름</th>
                    <th className="text-right p-4 text-gray-400 font-medium">가격</th>
                    <th className="text-right p-4 text-gray-400 font-medium">24시간 변동률</th>
                    <th className="text-right p-4 text-gray-400 font-medium hidden md:table-cell">시가총액</th>
                    <th className="text-right p-4 text-gray-400 font-medium hidden lg:table-cell">거래량 (24시간)</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCoinData.map((coin, index) => (
                    <tr
                      key={coin.symbol}
                      className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                        index % 2 === 0 ? "bg-gray-900/20" : "bg-gray-900/40"
                      }`}
                    >
                      <td className="p-4">
                        <span className="text-gray-300 font-medium">{coin.rank}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={coin.logo || "/placeholder.svg"} alt={coin.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="font-semibold text-white">{coin.name}</div>
                            <div className="text-sm text-gray-400">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-semibold text-white">{formatPrice(coin.price)}</span>
                      </td>
                      <td className="p-4 text-right">
                        <Badge
                          variant="secondary"
                          className={`${
                            coin.change24h >= 0
                              ? "bg-green-900/30 text-green-400 border-green-800"
                              : "bg-red-900/30 text-red-400 border-red-800"
                          } flex items-center gap-1 justify-end`}
                        >
                          {coin.change24h >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {coin.change24h >= 0 ? "+" : ""}
                          {coin.change24h.toFixed(2)}%
                        </Badge>
                      </td>
                      <td className="p-4 text-right hidden md:table-cell">
                        <span className="text-gray-300">{formatNumber(coin.marketCap)}</span>
                      </td>
                      <td className="p-4 text-right hidden lg:table-cell">
                        <span className="text-gray-300">{formatNumber(coin.volume)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>데이터는 60초마다 업데이트됩니다 • Powered by CoinAPI</p>
        </div>
      </div>
    </div>
  )
}
