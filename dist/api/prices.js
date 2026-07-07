"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrices = getPrices;
exports.getBTCDominance = getBTCDominance;
const axios_1 = __importDefault(require("axios"));
async function getPrices() {
    try {
        const { data } = await axios_1.default.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false', { timeout: 10000 });
        return data.map((c) => ({
            id: c.id,
            symbol: c.symbol.toUpperCase(),
            name: c.name,
            price: c.current_price,
            change24h: c.price_change_percentage_24h || 0,
            high24h: c.high_24h || 0,
            low24h: c.low_24h || 0,
            marketCap: c.market_cap || 0,
        }));
    }
    catch {
        return [];
    }
}
async function getBTCDominance() {
    try {
        const { data } = await axios_1.default.get('https://api.coingecko.com/api/v3/global', { timeout: 10000 });
        return data?.data?.market_cap_percentage?.btc ?? null;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=prices.js.map