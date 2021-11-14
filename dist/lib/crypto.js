"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = void 0;
const hmac_sha256_1 = __importDefault(require("crypto-js/hmac-sha256"));
const enc_hex_1 = __importDefault(require("crypto-js/enc-hex"));
function sign(secret, url, params) {
    const message = params ? `${url}?${params}` : url;
    console.log(`Signing message: ${message}`);
    const result = (0, hmac_sha256_1.default)(message, secret).toString(enc_hex_1.default);
    console.log(`Result ${result}`);
    return result;
}
exports.sign = sign;
