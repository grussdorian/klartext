"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var select_1 = require("./ui/select");
var constants_1 = require("../utils/constants");
var TargetAudience = function (_a) {
    var audience = _a.audience, setAudience = _a.setAudience;
    return (react_1.default.createElement(select_1.Select, { value: audience, onValueChange: setAudience },
        react_1.default.createElement(select_1.SelectTrigger, null,
            react_1.default.createElement(select_1.SelectValue, { placeholder: "Select target audience" })),
        react_1.default.createElement(select_1.SelectContent, null, constants_1.audienceOptions.map(function (option) { return (react_1.default.createElement(select_1.SelectItem, { key: option.value, value: option.value }, option.label)); }))));
};
exports.default = TargetAudience;
