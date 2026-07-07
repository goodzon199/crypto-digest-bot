import axios from 'axios';
import { load } from 'cheerio';

export interface NewsItem {
  title: string;
  source: string;
  url: string;
}

const SOURCES = [
  { name: 'ForkLog', url: 'https://forklog.com/feed' },
  { name: 'BeInCrypto', url: 'https://ru.beincrypto.com/feed/' },
  { name: 'Bits.media', url: 'https://bits.media/rss/' },
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function parseRSS(url: string): Promise<{ title: string; link: string }[]> {
  try {
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: { 'User-Agent': UA, 'Accept': 'application/rss+xml, application/xml, text/xml' },
    });
    const $ = load(data, { xmlMode: true });
    const items: { title: string; link: string }[] = [];
    $('item').each((_, el) => {
      const title = $(el).find('title').text().trim();
      const link = $(el).find('link').text().trim();
      if (title && link) items.push({ title, link });
    });
    return items.slice(0, 5);
  } catch { return []; }
}

export async function fetchNews(): Promise<NewsItem[]> {
  const all: NewsItem[] = [];
  for (const source of SOURCES) {
    const items = await parseRSS(source.url);
    items.forEach((item) => all.push({ title: item.title, source: source.name, url: item.link }));
  }
  const seen = new Set<string>();
  return all.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 10);
}
