import axios from 'axios';

export interface PriceData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  marketCap: number;
}

export async function getPrices(): Promise<PriceData[]> {
  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false',
      { timeout: 10000 },
    );
    return data.map((c: any) => ({
      id: c.id,
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      price: c.current_price,
      change24h: c.price_change_percentage_24h || 0,
      high24h: c.high_24h || 0,
      low24h: c.low_24h || 0,
      marketCap: c.market_cap || 0,
    }));
  } catch { return []; }
}

export async function getBTCDominance(): Promise<number | null> {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/global', { timeout: 10000 });
    return data?.data?.market_cap_percentage?.btc ?? null;
  } catch { return null; }
}
