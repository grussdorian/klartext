"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var SimplifiedText = function (_a) {
    var simplifiedText = _a.simplifiedText, selectedSentence = _a.selectedSentence, selectedWord = _a.selectedWord, handleWordClick = _a.handleWordClick, handleSentenceClick = _a.handleSentenceClick, clickable = _a.clickable;
    var clickTimeoutRef = (0, react_1.useRef)(null);
    var handleWordSingleClick = function (word) {
        if (clickable) {
            handleWordClick(word);
        }
    };
    var handleWordDoubleClick = function (word) {
        if (clickable) {
            var sentence = getSentenceContainingWord(word);
            handleSentenceClick(sentence);
        }
    };
    var handleWordClickEvent = function (word, event) {
        event.stopPropagation();
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            handleWordDoubleClick(word);
        }
        else {
            clickTimeoutRef.current = setTimeout(function () {
                handleWordSingleClick(word);
                clickTimeoutRef.current = null;
            }, 250);
        }
    };
    var handleSentenceDoubleClickEvent = function (sentence) {
        if (clickable) {
            handleSentenceClick(sentence);
        }
    };
    var getSentenceContainingWord = function (word) {
        var sentences = sanitizedText.split(". ");
        for (var _i = 0, sentences_1 = sentences; _i < sentences_1.length; _i++) {
            var sentence = sentences_1[_i];
            if (sentence.split(" ").includes(word)) {
                return sentence;
            }
        }
        return "";
    };
    (0, react_1.useEffect)(function () {
        return function () {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
            }
        };
    }, []);
    // Remove trailing period from simplifiedText if it exists
    var sanitizedText = simplifiedText.trim().endsWith(".")
        ? simplifiedText.trim().slice(0, -1)
        : simplifiedText.trim();
    return (react_1.default.createElement("div", { className: "p-4 bg-gray-50 rounded-md mb-4" },
        react_1.default.createElement("span", null, sanitizedText.split(". ").map(function (sentence, sentenceIndex, sentenceArray) { return (react_1.default.createElement("span", { key: sentenceIndex, className: sentence === selectedSentence
                ? "highlight-sentence"
                : "hover:bg-blue-100 cursor-pointer", onDoubleClick: function () { return handleSentenceDoubleClickEvent(sentence); } },
            sentence.split(" ").map(function (word, wordIndex) { return (react_1.default.createElement("span", { key: "".concat(sentenceIndex, "-").concat(wordIndex), className: word === selectedWord
                    ? "highlight-sentence"
                    : "hover:bg-red-100 cursor-pointer", onClick: function (event) { return handleWordClickEvent(word, event); } },
                word,
                wordIndex < sentence.split(" ").length - 1 ? " " : "")); }),
            sentenceIndex < sentenceArray.length - 1 ? ". " : ".")); }))));
};
exports.default = SimplifiedText;
