import dotenv from 'dotenv';
dotenv.config();

export const config = {
  bot: { token: process.env.BOT_TOKEN || '' },
  db: { path: process.env.DB_PATH || './data/users.json' },
};

if (!config.bot.token) { console.error('BOT_TOKEN required'); process.exit(1); }
