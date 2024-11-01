"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitRating = exports.uploadFile = exports.simplifyText = void 0;
var axios_1 = __importDefault(require("axios"));
var constants_1 = require("./constants");
var simplifyText = function (text, audience) { return axios_1.default.post("".concat(constants_1.BASE_URL, "/simplify"), { text: text, audience: audience }); };
exports.simplifyText = simplifyText;
var uploadFile = function (file, audience) {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("audience", audience);
    return axios_1.default.post("".concat(constants_1.BASE_URL, "/upload"), formData, { headers: { "Content-Type": "multipart/form-data" } });
};
exports.uploadFile = uploadFile;
var submitRating = function (rating) { return axios_1.default.post("".concat(constants_1.BASE_URL, "/rating"), null, { params: { rating: rating } }); };
exports.submitRating = submitRating;
