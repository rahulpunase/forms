"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_USER_QUERY = void 0;
const CREATE_USER_QUERY = `INSERT INTO users (id, name, surname, email, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, now(), now())`;
exports.CREATE_USER_QUERY = CREATE_USER_QUERY;
