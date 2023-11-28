"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_SESSION_QUERY = void 0;
const CREATE_SESSION_QUERY = `INSERT INTO sessions (session_id, user_id, device_id, is_active, token, created_at, updated_at) values (?, ?, ?, ?, ?, now(), now());`;
exports.CREATE_SESSION_QUERY = CREATE_SESSION_QUERY;
