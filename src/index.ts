import { Telegraf } from 'telegraf';
import cron from 'node-cron';
import { config } from './config';
import { loadDb } from './database';
import { setupBot, sendDigestToAll } from './bot/commands';

const bot = new Telegraf(config.bot.token);
loadDb();
setupBot(bot);

cron.schedule('0 10 * * *', () => sendDigestToAll(bot));
console.log('Daily digest scheduled at 10:00');

bot.launch().then(() => console.log('КриптоСводка is running!'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
