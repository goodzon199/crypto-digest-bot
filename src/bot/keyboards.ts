import { Markup } from 'telegraf';

export const mainKeyboard = Markup.keyboard([
  ['📊 Сводка сейчас'],
  ['🔔 Подписаться', '🔕 Отписаться'],
  ['❓ Помощь'],
]).resize();
