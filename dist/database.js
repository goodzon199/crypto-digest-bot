"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDb = loadDb;
exports.saveDb = saveDb;
exports.getUsers = getUsers;
exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;
exports.isSubscribed = isSubscribed;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
let db = { users: [] };
function ensureDir() {
    const dir = path_1.default.dirname(config_1.config.db.path);
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
}
function loadDb() {
    ensureDir();
    if (fs_1.default.existsSync(config_1.config.db.path)) {
        try {
            db = JSON.parse(fs_1.default.readFileSync(config_1.config.db.path, 'utf-8'));
        }
        catch {
            db = { users: [] };
        }
    }
}
function saveDb() {
    ensureDir();
    fs_1.default.writeFileSync(config_1.config.db.path, JSON.stringify(db, null, 2), 'utf-8');
}
function getUsers() { return db.users; }
function subscribe(id) {
    if (!db.users.includes(id)) {
        db.users.push(id);
        saveDb();
    }
}
function unsubscribe(id) {
    db.users = db.users.filter((u) => u !== id);
    saveDb();
}
function isSubscribed(id) {
    return db.users.includes(id);
}
//# sourceMappingURL=database.js.map