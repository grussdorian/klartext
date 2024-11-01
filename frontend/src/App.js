"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var TextSimplifier_1 = __importDefault(require("./components/TextSimplifier"));
function App() {
    return (react_1.default.createElement("div", { className: "min-h-screen bg-gray-50" },
        react_1.default.createElement(TextSimplifier_1.default, null)));
}
exports.default = App;
