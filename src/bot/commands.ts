import { Telegraf } from 'telegraf';
import { getPrices } from '../api/prices';
import { fetchNews } from '../api/news';
import { summarizeNews } from '../api/summarize';
import { formatDigest } from '../utils/formatters';
import { subscribe, unsubscribe, isSubscribed, getUsers } from '../database';
import { mainKeyboard } from './keyboards';

export function setupBot(bot: Telegraf) {
  bot.start(async (ctx) => {
    const name = ctx.from?.first_name || 'друг';
    await ctx.reply(
      `👋 Привет, ${name}!\n\n`
        + 'Я — *КриптоСводка* 📊\n'
        + 'Каждое утро присылаю: цены BTC/ETH, главные новости и AI-обзор.\n\n'
        + '📌 *Команды:*\n'
        + '/digest — сводка прямо сейчас\n'
        + '/subscribe — подписаться на ежедневную рассылку\n'
        + '/unsubscribe — отписаться\n'
        + '/help — помощь',
      { parse_mode: 'Markdown', ...mainKeyboard },
    );
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(
      '📊 *КриптоСводка*\n\n'
        + '📌 /digest — получить сводку сейчас\n'
        + '🔔 /subscribe — ежедневная рассылка в 10:00\n'
        + '🔕 /unsubscribe — отключить рассылку\n\n'
        + '💎 Партнёрские ссылки помогают проекту!',
      { parse_mode: 'Markdown' },
    );
  });

  bot.command('digest', async (ctx) => {
    await ctx.reply('🔍 Собираю данные...');
    await sendDigest(ctx.chat.id, bot);
  });

  bot.command('subscribe', async (ctx) => {
    const cid = ctx.chat?.id;
    if (!cid) return;
    subscribe(cid);
    await ctx.reply('✅ Вы подписались на ежедневную рассылку! Сводка будет приходить в 10:00.', mainKeyboard);
  });

  bot.command('unsubscribe', async (ctx) => {
    const cid = ctx.chat?.id;
    if (!cid) return;
    unsubscribe(cid);
    await ctx.reply('🔕 Вы отписались от рассылки.', mainKeyboard);
  });

  bot.hears('📊 Сводка сейчас', async (ctx) => {
    const cid = ctx.chat?.id;
    if (!cid) return;
    await ctx.reply('🔍 Собираю данные...');
    await sendDigest(cid, bot);
  });

  bot.hears('🔔 Подписаться', async (ctx) => {
    const cid = ctx.chat?.id;
    if (!cid) return;
    subscribe(cid);
    await ctx.reply('✅ Подписали!');
  });

  bot.hears('🔕 Отписаться', async (ctx) => {
    const cid = ctx.chat?.id;
    if (!cid) return;
    unsubscribe(cid);
    await ctx.reply('🔕 Отписали.');
  });

  bot.hears('❓ Помощь', async (ctx) => {
    await ctx.reply('/digest — сводка\n/subscribe — подписаться', mainKeyboard);
  });
}

export async function sendDigest(chatId: number, bot: Telegraf) {
  try {
    const [prices, news] = await Promise.all([getPrices(), fetchNews()]);
    const summary = news.length > 0 ? await summarizeNews(news) : '';
    const msg = formatDigest(prices, news, summary);
    await bot.telegram.sendMessage(chatId, msg, {
      parse_mode: 'Markdown',
      link_preview_options: { is_disabled: true },
    });
  } catch (error) {
    console.error('Digest error:', error);
  }
}

export async function sendDigestToAll(bot: Telegraf) {
  const users = getUsers();
  console.log(`[${new Date().toISOString()}] Sending digest to ${users.length} users...`);
  const [prices, news] = await Promise.all([getPrices(), fetchNews()]);
  const summary = news.length > 0 ? await summarizeNews(news) : '';
  const msg = formatDigest(prices, news, summary);
  for (const uid of users) {
    try {
      await bot.telegram.sendMessage(uid, msg, {
        parse_mode: 'Markdown',
        link_preview_options: { is_disabled: true },
      });
    } catch { }
  }
}
