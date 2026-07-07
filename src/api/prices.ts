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

export interface FearGreed { value: number; label: string }

export async function getFearGreed(): Promise<FearGreed | null> {
  try {
    const { data } = await axios.get('https://api.alternative.me/fng/?limit=1', { timeout: 10000 });
    if (data?.data?.[0]) {
      return { value: parseInt(data.data[0].value), label: data.data[0].value_classification };
    }
    return null;
  } catch { return null; }
}

const COINGECKO_IDS: Record<string, string> = {
  'BTC': 'bitcoin', 'BITCOIN': 'bitcoin',
  'ETH': 'ethereum', 'ETHEREUM': 'ethereum',
  'USDT': 'tether', 'USDC': 'usd-coin',
  'BNB': 'binancecoin', 'SOL': 'solana',
  'XRP': 'ripple', 'ADA': 'cardano',
  'DOT': 'polkadot', 'DOGE': 'dogecoin',
  'TON': 'the-open-network', 'NOT': 'notcoin',
  'RUB': 'rub', 'USD': 'usd', 'EUR': 'eur',
};

export async function convertCrypto(query: string): Promise<string | null> {
  try {
    const parts = query.trim().split(/\s+/);
    if (parts.length < 4) return null;
    const amount = parseFloat(parts[0]);
    if (isNaN(amount) || amount <= 0) return null;
    const from = parts[1].toUpperCase();
    const to = parts[3].toUpperCase();

    const fromId = COINGECKO_IDS[from];
    const toId = COINGECKO_IDS[to];
    if (!fromId || !toId) return null;

    if (fromId === toId) {
      return `${amount} ${from} = ${amount} ${to}`;
    }

    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fromId},${toId}&vs_currencies=usd,rub`,
      { timeout: 10000 },
    );

    const fromPrice = data[fromId]?.usd || data[fromId]?.rub;
    const toPrice = data[toId]?.usd || data[toId]?.rub;

    if (fromPrice && toPrice) {
      const result = (amount * fromPrice) / toPrice;
      return `${amount} ${from} = ${result.toFixed(2)} ${to}`;
    }
    if (toId === 'usd' || toId === 'rub') {
      const price = data[fromId]?.[toId];
      if (price) {
        const result = amount * price;
        return `${amount} ${from} = ${result.toLocaleString('ru-RU')} ${to}`;
      }
    }
    return null;
  } catch { return null; }
}
