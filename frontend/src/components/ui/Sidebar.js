"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// components/Sidebar.tsx
var react_1 = __importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var Sidebar = function (_a) {
    var isOpen = _a.isOpen, toggleSidebar = _a.toggleSidebar, sidebarEntries = _a.sidebarEntries, removeSidebarEntry = _a.removeSidebarEntry, handleWordClick = _a.handleWordClick, handleSynonymClick = _a.handleSynonymClick, setSelectedWord = _a.setSelectedWord;
    return (react_1.default.createElement("div", { className: "fixed top-0 right-0 w-72 h-full bg-gray-50 p-4 border-l shadow-lg overflow-auto transform transition-transform duration-300 ease-in-out ".concat(isOpen ? "translate-x-0" : "translate-x-full") },
        react_1.default.createElement("button", { onClick: toggleSidebar, className: "text-primary-foreground hover:text-red-700 mb-4" }, "Close Sidebar"),
        react_1.default.createElement("h3", { className: "font-bold mb-4" }, "Definitions & Synonyms"),
        sidebarEntries.map(function (entry) { return (react_1.default.createElement("div", { key: entry.word, className: "mb-4 bg-white p-3 rounded-md shadow-sm" },
            react_1.default.createElement("div", { className: "flex justify-between items-center mb-2" },
                react_1.default.createElement("strong", null, entry.word),
                react_1.default.createElement("button", { onClick: function () { return removeSidebarEntry(entry.word); }, className: "text-primary-foreground hover:text-red-700" },
                    react_1.default.createElement(lucide_react_1.X, { className: "h-4 w-4" }))),
            react_1.default.createElement("p", { className: "text-sm mb-2" },
                react_1.default.createElement("strong", null, "Definition:"),
                " ",
                entry.definition),
            react_1.default.createElement("p", { className: "text-sm" },
                react_1.default.createElement("strong", null, "Synonyms:"),
                " ",
                entry.synonyms.map(function (synonym, index) { return (react_1.default.createElement("span", { key: index, className: "hover:bg-blue-100 cursor-pointer px-1 rounded", onClick: function (event) {
                        setSelectedWord(entry.word);
                        handleSynonymClick(synonym, event);
                    } },
                    synonym,
                    " ")); })))); })));
};
exports.default = Sidebar;
