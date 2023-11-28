"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notAvailableValidate = void 0;
const notAvailableValidate = (body, propertiesToValidated) => {
    const notAvailable = [];
    propertiesToValidated.forEach((property) => {
        if (!body[property]) {
            notAvailable.push(property);
        }
    });
    return notAvailable.join(", ");
};
exports.notAvailableValidate = notAvailableValidate;
