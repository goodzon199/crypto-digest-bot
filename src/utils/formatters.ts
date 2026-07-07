import { PriceData } from '../api/prices';
import { NewsItem } from '../api/news';

export function formatDigest(prices: PriceData[], news: NewsItem[], summary: string, fng?: { value: number; label: string }): string {
  const date = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
  let msg = `📊 *КриптоСводка — ${date}*\n\n`;

  msg += '*🏆 Топ криптовалют:*\n';
  for (const p of prices.slice(0, 5)) {
    const emoji = p.change24h >= 0 ? '🟢' : '🔴';
    const change = p.change24h >= 0 ? `+${p.change24h.toFixed(2)}%` : `${p.change24h.toFixed(2)}%`;
    const price = p.price >= 1 ? `$${p.price.toLocaleString('ru-RU')}` : `$${p.price.toFixed(6)}`;
    msg += `${emoji} *${p.symbol}*: ${price} (${change})\n`;
  }

  if (fng) {
    const fngEmoji = fng.label === 'Fear' || fng.label === 'Extreme Fear' ? '😨' : '😎';
    msg += `\n${fngEmoji} *Fear & Greed:* ${fng.value}/100 (${fng.label})`;
  }

  msg += '\n\n*📰 Главные новости:*\n';
  for (const n of news.slice(0, 5)) {
    msg += `🔹 [${n.title}](${n.url}) — _${n.source}_\n`;
  }

  msg += '\n💎 *Зарабатывай с нами:*\n';
  msg += '▫️ [Bybit — бонус до $30](https://www.bybit.com/invite?ref=66MRXR)\n';
  msg += '▫️ [Gate — торговля с выгодой](https://www.gate.com/rewards_hub?ch=RewardsHub&ref=VFZFVV8K&ref_type=145)\n';

  return msg;
}

export function formatPriceAlert(p: PriceData): string {
  const emoji = p.change24h >= 0 ? '📈' : '📉';
  const change = p.change24h >= 0 ? `+${p.change24h.toFixed(2)}%` : `${p.change24h.toFixed(2)}%`;
  return `${emoji} *${p.symbol}*: $${p.price >= 1 ? p.price.toLocaleString('ru-RU') : p.price.toFixed(6)} (${change})`;
}
