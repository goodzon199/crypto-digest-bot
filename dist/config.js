"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    bot: { token: process.env.BOT_TOKEN || '' },
    db: { path: process.env.DB_PATH || './data/users.json' },
};
if (!exports.config.bot.token) {
    console.error('BOT_TOKEN required');
    process.exit(1);
}
//# sourceMappingURL=config.js.map