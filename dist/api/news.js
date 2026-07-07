"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNews = fetchNews;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const SOURCES = [
    { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
    { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss' },
    { name: 'Decrypt', url: 'https://decrypt.co/feed' },
    { name: 'CryptoSlate', url: 'https://cryptoslate.com/feed/' },
];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
async function parseRSS(url) {
    try {
        const { data } = await axios_1.default.get(url, {
            timeout: 10000,
            headers: { 'User-Agent': UA, 'Accept': 'application/rss+xml, application/xml, text/xml' },
        });
        const $ = (0, cheerio_1.load)(data, { xmlMode: true });
        const items = [];
        $('item').each((_, el) => {
            const title = $(el).find('title').text().trim();
            const link = $(el).find('link').text().trim();
            if (title && link)
                items.push({ title, link });
        });
        return items.slice(0, 7);
    }
    catch {
        return [];
    }
}
async function fetchNews() {
    const all = [];
    for (const source of SOURCES) {
        const items = await parseRSS(source.url);
        items.forEach((item) => all.push({ title: item.title, source: source.name, url: item.link }));
    }
    const seen = new Set();
    return all.filter((item) => {
        const key = item.title.toLowerCase().slice(0, 60);
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
//# sourceMappingURL=news.js.map