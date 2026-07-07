"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeNews = summarizeNews;
const axios_1 = __importDefault(require("axios"));
async function summarizeNews(news) {
    const items = news.slice(0, 8).map((n) => n.title).join('\n');
    try {
        const { data } = await axios_1.default.post('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', { inputs: items }, { timeout: 30000, headers: { 'Content-Type': 'application/json' } });
        if (data?.[0]?.summary_text)
            return data[0].summary_text;
    }
    catch { }
    return '';
}
//# sourceMappingURL=summarize.js.map