import { Markup } from 'telegraf';

export const mainKeyboard = Markup.keyboard([
  ['📊 Сводка сейчас'],
  ['💱 Конвертер', '📤 Поделиться'],
  ['🔔 Подписаться', '🔕 Отписаться'],
  ['❓ Помощь'],
]).resize();
