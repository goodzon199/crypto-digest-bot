"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupBot = setupBot;
exports.sendDigest = sendDigest;
exports.sendDigestToAll = sendDigestToAll;
const prices_1 = require("../api/prices");
const news_1 = require("../api/news");
const summarize_1 = require("../api/summarize");
const formatters_1 = require("../utils/formatters");
const database_1 = require("../database");
const keyboards_1 = require("./keyboards");
function setupBot(bot) {
    bot.start(async (ctx) => {
        const name = ctx.from?.first_name || 'друг';
        await ctx.reply(`👋 Привет, ${name}!\n\n`
            + 'Я — *КриптоСводка* 📊\n'
            + 'Каждое утро присылаю: цены BTC/ETH, главные новости и AI-обзор.\n\n'
            + '📌 *Команды:*\n'
            + '/digest — сводка прямо сейчас\n'
            + '/subscribe — подписаться на ежедневную рассылку\n'
            + '/unsubscribe — отписаться\n'
            + '/help — помощь', { parse_mode: 'Markdown', ...keyboards_1.mainKeyboard });
    });
    bot.command('help', async (ctx) => {
        await ctx.reply('📊 *КриптоСводка*\n\n'
            + '📌 /digest — получить сводку сейчас\n'
            + '🔔 /subscribe — ежедневная рассылка в 10:00\n'
            + '🔕 /unsubscribe — отключить рассылку\n\n'
            + '💎 Партнёрские ссылки помогают проекту!', { parse_mode: 'Markdown' });
    });
    bot.command('digest', async (ctx) => {
        await ctx.reply('🔍 Собираю данные...');
        await sendDigest(ctx.chat.id, bot);
    });
    bot.command('subscribe', async (ctx) => {
        const cid = ctx.chat?.id;
        if (!cid)
            return;
        (0, database_1.subscribe)(cid);
        await ctx.reply('✅ Вы подписались на ежедневную рассылку! Сводка будет приходить в 10:00.', keyboards_1.mainKeyboard);
    });
    bot.command('unsubscribe', async (ctx) => {
        const cid = ctx.chat?.id;
        if (!cid)
            return;
        (0, database_1.unsubscribe)(cid);
        await ctx.reply('🔕 Вы отписались от рассылки.', keyboards_1.mainKeyboard);
    });
    bot.hears('📊 Сводка сейчас', async (ctx) => {
        const cid = ctx.chat?.id;
        if (!cid)
            return;
        await ctx.reply('🔍 Собираю данные...');
        await sendDigest(cid, bot);
    });
    bot.hears('🔔 Подписаться', async (ctx) => {
        const cid = ctx.chat?.id;
        if (!cid)
            return;
        (0, database_1.subscribe)(cid);
        await ctx.reply('✅ Подписали!');
    });
    bot.hears('🔕 Отписаться', async (ctx) => {
        const cid = ctx.chat?.id;
        if (!cid)
            return;
        (0, database_1.unsubscribe)(cid);
        await ctx.reply('🔕 Отписали.');
    });
    bot.hears('❓ Помощь', async (ctx) => {
        await ctx.reply('/digest — сводка\n/subscribe — подписаться', keyboards_1.mainKeyboard);
    });
}
async function sendDigest(chatId, bot) {
    try {
        const [prices, news] = await Promise.all([(0, prices_1.getPrices)(), (0, news_1.fetchNews)()]);
        const summary = news.length > 0 ? await (0, summarize_1.summarizeNews)(news) : '';
        const msg = (0, formatters_1.formatDigest)(prices, news, summary);
        await bot.telegram.sendMessage(chatId, msg, {
            parse_mode: 'Markdown',
            link_preview_options: { is_disabled: true },
        });
    }
    catch (error) {
        console.error('Digest error:', error);
    }
}
async function sendDigestToAll(bot) {
    const users = (0, database_1.getUsers)();
    console.log(`[${new Date().toISOString()}] Sending digest to ${users.length} users...`);
    const [prices, news] = await Promise.all([(0, prices_1.getPrices)(), (0, news_1.fetchNews)()]);
    const summary = news.length > 0 ? await (0, summarize_1.summarizeNews)(news) : '';
    const msg = (0, formatters_1.formatDigest)(prices, news, summary);
    for (const uid of users) {
        try {
            await bot.telegram.sendMessage(uid, msg, {
                parse_mode: 'Markdown',
                link_preview_options: { is_disabled: true },
            });
        }
        catch { }
    }
}
//# sourceMappingURL=commands.js.map