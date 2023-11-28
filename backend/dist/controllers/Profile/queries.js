"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_PASSWORD_FAILURE_ATTEMPT_QUERY = exports.CREATE_PROFILE_QUERY = void 0;
const CREATE_PROFILE_QUERY = `
    INSERT INTO profile (profile_id, user_id, password, is_active, created_at, updated_at) 
    values (?, ?, ?, ?, now(), now())
`;
exports.CREATE_PROFILE_QUERY = CREATE_PROFILE_QUERY;
const UPDATE_PASSWORD_FAILURE_ATTEMPT_QUERY = `UPDATE profile SET password_failure_attempt = password_failure_attempt + 1 WHERE user_id = ?;`;
exports.UPDATE_PASSWORD_FAILURE_ATTEMPT_QUERY = UPDATE_PASSWORD_FAILURE_ATTEMPT_QUERY;
