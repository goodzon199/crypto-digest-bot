"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDigest = formatDigest;
exports.formatPriceAlert = formatPriceAlert;
function formatDigest(prices, news, summary) {
    const date = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    let msg = `📊 *КриптоСводка — ${date}*\n\n`;
    msg += '*🏆 Топ-10 криптовалют:*\n';
    for (const p of prices.slice(0, 5)) {
        const emoji = p.change24h >= 0 ? '🟢' : '🔴';
        const change = p.change24h >= 0 ? `+${p.change24h.toFixed(2)}%` : `${p.change24h.toFixed(2)}%`;
        const price = p.price >= 1 ? `$${p.price.toLocaleString('ru-RU')}` : `$${p.price.toFixed(6)}`;
        msg += `${emoji} *${p.symbol}*: ${price} (${change})\n`;
    }
    msg += '\n';
    if (summary) {
        msg += `*📰 Главное:*\n${summary}\n\n`;
    }
    msg += '*📡 Топ новости:*\n';
    for (const n of news.slice(0, 5)) {
        msg += `🔹 [${n.title}](${n.url}) — _${n.source}_\n`;
    }
    msg += '\n💎 *Зарабатывай с нами:*\n';
    msg += '▫️ [Bybit — бонус до $30](https://partner.bybit.com/b/cryptosvodka)\n';
    msg += '▫️ [Binance — скидка на комиссию](https://accounts.binance.com/register?ref=CRYPTOSVODKA)\n';
    return msg;
}
function formatPriceAlert(p) {
    const emoji = p.change24h >= 0 ? '📈' : '📉';
    const change = p.change24h >= 0 ? `+${p.change24h.toFixed(2)}%` : `${p.change24h.toFixed(2)}%`;
    return `${emoji} *${p.symbol}*: $${p.price >= 1 ? p.price.toLocaleString('ru-RU') : p.price.toFixed(6)} (${change})`;
}
//# sourceMappingURL=formatters.js.map