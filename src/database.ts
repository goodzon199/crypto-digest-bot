import fs from 'fs';
import path from 'path';
import { config } from './config';

interface DbData { users: number[] }
let db: DbData = { users: [] };

function ensureDir() {
  const dir = path.dirname(config.db.path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function loadDb() {
  ensureDir();
  if (fs.existsSync(config.db.path)) {
    try { db = JSON.parse(fs.readFileSync(config.db.path, 'utf-8')); }
    catch { db = { users: [] }; }
  }
}

export function saveDb() {
  ensureDir();
  fs.writeFileSync(config.db.path, JSON.stringify(db, null, 2), 'utf-8');
}

export function getUsers(): number[] { return db.users; }

export function subscribe(id: number) {
  if (!db.users.includes(id)) { db.users.push(id); saveDb(); }
}

export function unsubscribe(id: number) {
  db.users = db.users.filter((u) => u !== id);
  saveDb();
}

export function isSubscribed(id: number): boolean {
  return db.users.includes(id);
}
