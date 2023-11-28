"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
class DbConnection {
    constructor() {
        this.pool = null;
    }
    createPool() {
        this.pool = mysql2_1.default.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            database: process.env.DATABASE,
            password: process.env.PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });
    }
    getPool() {
        return this.pool;
    }
}
exports.default = DbConnection;
