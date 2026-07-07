import axios from 'axios';
import { NewsItem } from './news';

export async function summarizeNews(news: NewsItem[]): Promise<string> {
  const items = news.slice(0, 8).map((n) => n.title).join('\n');
  try {
    const { data } = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: items },
      { timeout: 30000, headers: { 'Content-Type': 'application/json' } },
    );
    if (data?.[0]?.summary_text) return data[0].summary_text;
  } catch { }
  return '';
}
