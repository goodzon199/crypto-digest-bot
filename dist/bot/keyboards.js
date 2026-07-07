"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainKeyboard = void 0;
const telegraf_1 = require("telegraf");
exports.mainKeyboard = telegraf_1.Markup.keyboard([
    ['📊 Сводка сейчас'],
    ['🔔 Подписаться', '🔕 Отписаться'],
    ['❓ Помощь'],
]).resize();
//# sourceMappingURL=keyboards.js.map