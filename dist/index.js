"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const node_cron_1 = __importDefault(require("node-cron"));
const config_1 = require("./config");
const database_1 = require("./database");
const commands_1 = require("./bot/commands");
const bot = new telegraf_1.Telegraf(config_1.config.bot.token);
(0, database_1.loadDb)();
(0, commands_1.setupBot)(bot);
node_cron_1.default.schedule('0 10 * * *', () => (0, commands_1.sendDigestToAll)(bot));
console.log('Daily digest scheduled at 10:00');
bot.launch().then(() => console.log('КриптоСводка is running!'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//# sourceMappingURL=index.js.map