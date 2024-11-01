"use strict";
// Language: typescript
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var axios_1 = __importDefault(require("axios"));
var card_1 = require("./ui/card");
var button_1 = require("./ui/button");
var Sidebar_1 = __importDefault(require("./ui/Sidebar"));
var constants_1 = require("../utils/constants");
var InputSection_1 = __importDefault(require("./InputSection"));
var TargetAudience_1 = __importDefault(require("./TargetAudience"));
var OutputSection_1 = __importDefault(require("./OutputSection"));
var RatingSection_1 = __importDefault(require("./RatingSection"));
var alert_1 = require("./ui/alert");
var TextSimplifier = function () {
    var _a = (0, react_1.useState)("text"), inputMethod = _a[0], setInputMethod = _a[1];
    var _b = (0, react_1.useState)(""), inputText = _b[0], setInputText = _b[1];
    var _c = (0, react_1.useState)("general"), audience = _c[0], setAudience = _c[1];
    var _d = (0, react_1.useState)(""), simplifiedText = _d[0], setSimplifiedText = _d[1];
    var _e = (0, react_1.useState)(false), isLoading = _e[0], setIsLoading = _e[1];
    var _f = (0, react_1.useState)(null), selectedWord = _f[0], setSelectedWord = _f[1];
    var _g = (0, react_1.useState)(""), selectedSentence = _g[0], setSelectedSentence = _g[1];
    var _h = (0, react_1.useState)(""), furtherSimplifiedText = _h[0], setFurtherSimplifiedText = _h[1];
    var _j = (0, react_1.useState)([]), sidebarEntries = _j[0], setSidebarEntries = _j[1];
    var _k = (0, react_1.useState)(5), rating = _k[0], setRating = _k[1];
    var _l = (0, react_1.useState)(""), feedback = _l[0], setFeedback = _l[1];
    var _m = (0, react_1.useState)(""), error = _m[0], setError = _m[1];
    var _o = (0, react_1.useState)(false), isSidebarOpen = _o[0], setIsSidebarOpen = _o[1];
    var _p = (0, react_1.useState)(null), uploadedFile = _p[0], setUploadedFile = _p[1];
    var _q = (0, react_1.useState)(null), synonymToReplace = _q[0], setSynonymToReplace = _q[1];
    var _r = (0, react_1.useState)(false), isExpertMode = _r[0], setIsExpertMode = _r[1];
    var _s = (0, react_1.useState)(false), popupVisible = _s[0], setPopupVisible = _s[1];
    var _t = (0, react_1.useState)({ x: 0, y: 0 }), popupPosition = _t[0], setPopupPosition = _t[1];
    var _u = (0, react_1.useState)(""), currentSynonym = _u[0], setCurrentSynonym = _u[1];
    var handleSimplifyText = function () { return __awaiter(void 0, void 0, void 0, function () {
        var audienceLabel, response, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setIsLoading(true);
                    setError("");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    audienceLabel = (_a = constants_1.audienceOptions.find(function (opt) { return opt.value === audience; })) === null || _a === void 0 ? void 0 : _a.label;
                    return [4 /*yield*/, axios_1.default.post("".concat(constants_1.BASE_URL, "/simplify"), {
                            text: inputText,
                            audience: audienceLabel,
                        })];
                case 2:
                    response = _b.sent();
                    setSimplifiedText(response.data.simplifiedText);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    console.log(err_1);
                    setError("Failed to simplify text. ".concat(err_1.message));
                    return [3 /*break*/, 4];
                case 4:
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleUploadFile = function () { return __awaiter(void 0, void 0, void 0, function () {
        var audienceLabel, formData, response, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!uploadedFile)
                        return [2 /*return*/];
                    setIsLoading(true);
                    setError("");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    audienceLabel = (_a = constants_1.audienceOptions.find(function (opt) { return opt.value === audience; })) === null || _a === void 0 ? void 0 : _a.label;
                    formData = new FormData();
                    formData.append("file", uploadedFile);
                    formData.append("audience", audienceLabel || "");
                    return [4 /*yield*/, axios_1.default.post("".concat(constants_1.BASE_URL, "/simplify"), formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                        })];
                case 2:
                    response = _b.sent();
                    setSimplifiedText(response.data.simplifiedText);
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _b.sent();
                    console.log(err_2);
                    setError("Failed to simplify text. ".concat(err_2.message));
                    return [3 /*break*/, 4];
                case 4:
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleWordClick = (0, react_1.useCallback)(function (word) { return __awaiter(void 0, void 0, void 0, function () {
        var cleanWord, _a, definitionData, synonymsData, definition_1, synonyms_1, err_3;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!isExpertMode || isLoading)
                        return [2 /*return*/];
                    setIsSidebarOpen(true);
                    cleanWord = word.replace(/[^a-zA-Z\s]/g, "").toLowerCase();
                    // Check if the word already exists in sidebarEntries to prevent duplicates
                    if (sidebarEntries.some(function (entry) { return entry.word === cleanWord; })) {
                        return [2 /*return*/];
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all([
                            axios_1.default.get("https://api.dictionaryapi.dev/api/v2/entries/en/".concat(cleanWord)),
                            axios_1.default.get("https://api.datamuse.com/words?rel_syn=".concat(cleanWord)),
                        ])];
                case 2:
                    _a = _e.sent(), definitionData = _a[0].data, synonymsData = _a[1].data;
                    definition_1 = ((_d = (_c = (_b = definitionData[0]) === null || _b === void 0 ? void 0 : _b.meanings[0]) === null || _c === void 0 ? void 0 : _c.definitions[0]) === null || _d === void 0 ? void 0 : _d.definition) ||
                        "Definition not found.";
                    synonyms_1 = synonymsData.length
                        ? synonymsData.map(function (syn) { return syn.word; })
                        : ["No synonyms found."];
                    setSidebarEntries(function (prev) { return __spreadArray(__spreadArray([], prev, true), [
                        { word: cleanWord, definition: definition_1, synonyms: synonyms_1 },
                    ], false); });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _e.sent();
                    setSidebarEntries(function (prev) { return __spreadArray(__spreadArray([], prev, true), [
                        {
                            word: cleanWord,
                            definition: "Error fetching definition.",
                            synonyms: ["Error fetching synonyms."],
                        },
                    ], false); });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [sidebarEntries, isExpertMode, isLoading]);
    var removeSidebarEntry = function (word) {
        setSidebarEntries(function (prev) { return prev.filter(function (entry) { return entry.word !== word; }); });
    };
    var toggleSidebar = function () { return setIsSidebarOpen(function (prev) { return !prev; }); };
    var toggleExpertMode = function () {
        setFurtherSimplifiedText("");
        setSelectedSentence("");
        setIsExpertMode(function (prev) { return !prev; });
    };
    var handleFeedbackSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post("".concat(constants_1.BASE_URL, "/rating"), null, {
                            params: { rating: rating, feedback: feedback },
                        })];
                case 1:
                    _b.sent();
                    alert("Rating and feedback sent successfully!");
                    setFeedback(""); // Clear feedback after submission
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    alert("Failed to send rating.");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        // Reset states when the input method changes
        setInputText(""); // Clear any entered text
        setUploadedFile(null); // Remove any uploaded file
        setSimplifiedText(""); // Clear any previously simplified text
        setFurtherSimplifiedText(""); // Clear any further simplifications
        setSelectedSentence(""); // Clear selected sentence for further simplification
        setError(""); // Clear any errors from the previous input method
        setSidebarEntries([]); // Clear any sidebar entries
        // Optionally, reset more states as needed for your app
    }, [inputMethod]);
    // Handle word replacement
    (0, react_1.useEffect)(function () {
        if (selectedWord && synonymToReplace) {
            var highlightedText = simplifiedText.replace(new RegExp("\\b".concat(selectedWord, "\\b"), "g"), synonymToReplace);
            setSimplifiedText(highlightedText);
            setSelectedWord(null);
            setSynonymToReplace(null);
        }
    }, [selectedWord, synonymToReplace, simplifiedText]);
    // Function to replace the selected word with a synonym based on user choice
    var replaceWord = function (synonym, choice) {
        if (choice) {
            setSynonymToReplace(synonym);
        }
        // If canceled, do nothing
    };
    // Function triggered when a synonym is clicked
    var handleSynonymClick = function (synonym, event) {
        var popupWidth = 250; // Estimated width of the popup in pixels
        var popupHeight = 150; // Estimated height of the popup in pixels
        var margin = 10; // Margin from the viewport edges
        var x = event.clientX;
        var y = event.clientY;
        // Adjust X position if popup goes beyond the right edge
        if (x + popupWidth > window.innerWidth) {
            x = window.innerWidth - popupWidth - margin;
        }
        // Adjust Y position if popup goes beyond the bottom edge
        if (y + popupHeight > window.innerHeight) {
            y = window.innerHeight - popupHeight - margin;
        }
        setPopupPosition({ x: x, y: y });
        setCurrentSynonym(synonym);
        setPopupVisible(true);
    };
    // Function to handle user's choice in the popup
    var handleUserChoice = function (replace) {
        setPopupVisible(false);
        replaceWord(currentSynonym, replace);
    };
    // Handle sentence double-click
    var handleSentenceClick = function (sentence) {
        if (!isExpertMode)
            return;
        setSelectedSentence(sentence);
        handleFurtherSimplification(sentence);
    };
    // Function to further simplify the selected sentence
    var handleFurtherSimplification = function (sentence) { return __awaiter(void 0, void 0, void 0, function () {
        var audienceLabel, response, err_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!sentence)
                        return [2 /*return*/];
                    setIsLoading(true);
                    setError("");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    audienceLabel = (_a = constants_1.audienceOptions.find(function (opt) { return opt.value === audience; })) === null || _a === void 0 ? void 0 : _a.label;
                    return [4 /*yield*/, axios_1.default.post("".concat(constants_1.BASE_URL, "/simplify"), {
                            text: sentence,
                            audience: audienceLabel,
                        })];
                case 2:
                    response = _b.sent();
                    setFurtherSimplifiedText(response.data.simplifiedText); // Set the further simplified text
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _b.sent();
                    console.log(err_4);
                    setError("Failed to simplify the selected sentence. ".concat(err_4.message, "."));
                    return [3 /*break*/, 4];
                case 4:
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    // Language: typescript
    var removeDoublePeriods = function (text) {
        return text.replace(/\.{2,}/g, '.');
    };
    // Function to replace the selected sentence with the further simplified sentence
    var handleUpdateSimplifiedText = function () {
        if (!selectedSentence || !furtherSimplifiedText)
            return;
        var updatedText = simplifiedText.replace(new RegExp("\\b".concat(selectedSentence, "\\b")), furtherSimplifiedText);
        updatedText = removeDoublePeriods(updatedText);
        setSimplifiedText(updatedText); // Update the main simplified text
        setFurtherSimplifiedText(""); // Clear the further simplified text
        setSelectedSentence(""); // Clear the selected sentence
    };
    return (react_1.default.createElement("div", { className: "flex justify-center items-start" },
        " ",
        react_1.default.createElement("div", { className: "max-w-3xl w-full mx-4 p-4" },
            " ",
            react_1.default.createElement(card_1.Card, { className: "mb-4" },
                react_1.default.createElement(card_1.CardHeader, null,
                    react_1.default.createElement(card_1.CardTitle, null, "Klartext: AI-based Translation of Websites Into Plain Language")),
                react_1.default.createElement(card_1.CardContent, null,
                    react_1.default.createElement(InputSection_1.default, { inputMethod: inputMethod, setInputMethod: function (method) { return setInputMethod(method); }, inputText: inputText, setInputText: setInputText, uploadedFile: uploadedFile, setUploadedFile: setUploadedFile, handleUploadFile: handleUploadFile, handleSimplifyText: handleSimplifyText, isLoading: isLoading }),
                    react_1.default.createElement(TargetAudience_1.default, { audience: audience, setAudience: setAudience }),
                    error && react_1.default.createElement(alert_1.Alert, { variant: "destructive" }, error),
                    simplifiedText && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(OutputSection_1.default, { simplifiedText: simplifiedText, selectedWord: selectedWord, handleWordClick: handleWordClick, selectedSentence: selectedSentence, handleSentenceClick: handleSentenceClick, clickable: isExpertMode }),
                        react_1.default.createElement("div", { className: "flex items-center gap-4 mt-4" },
                            react_1.default.createElement("span", { className: "text-gray-700 font-medium" }, "Expert Mode"),
                            react_1.default.createElement("div", { onClick: toggleExpertMode, className: "relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors ".concat(isExpertMode ? "bg-blue-600" : "bg-gray-300") },
                                react_1.default.createElement("span", { className: "absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ".concat(isExpertMode ? "translate-x-6" : "") }))),
                        isExpertMode && (react_1.default.createElement("div", { className: "text-gray-600 mt-2" },
                            react_1.default.createElement("p", null, "In Expert Mode, click on words for definitions and synonyms, and double-click sentences for further simplification."))),
                        isExpertMode && furtherSimplifiedText && (react_1.default.createElement("div", { className: "p-4 bg-green-50 rounded-md mt-4" },
                            react_1.default.createElement("h3", { className: "text-lg font-semibold" }, "Further Simplified Sentence:"),
                            react_1.default.createElement("p", null, furtherSimplifiedText),
                            react_1.default.createElement(button_1.Button, { onClick: handleUpdateSimplifiedText, className: "mt-2" }, "Replace Selected Sentence"))),
                        react_1.default.createElement(RatingSection_1.default, { rating: rating, setRating: setRating, handleFeedbackSubmit: handleFeedbackSubmit, feedback: feedback, setFeedback: setFeedback })))))),
        react_1.default.createElement(Sidebar_1.default, { isOpen: isSidebarOpen, toggleSidebar: toggleSidebar, sidebarEntries: sidebarEntries, removeSidebarEntry: removeSidebarEntry, handleWordClick: handleWordClick, handleSynonymClick: function (synonym, event) { return handleSynonymClick(synonym, event); }, setSelectedWord: setSelectedWord }),
        popupVisible && (react_1.default.createElement("div", { className: "absolute bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50", style: {
                top: popupPosition.y,
                left: popupPosition.x,
                width: "250px", // Fixed width to match popupWidth in handler
                boxSizing: "border-box",
            } },
            react_1.default.createElement("p", { className: "mb-4 text-gray-700" },
                "Replace this occurrence of the word with",
                " ",
                react_1.default.createElement("span", { className: "font-semibold" },
                    "\"",
                    currentSynonym,
                    "\""),
                "?"),
            react_1.default.createElement("div", { className: "flex justify-end space-x-2" },
                react_1.default.createElement("button", { onClick: function () { return handleUserChoice(true); }, className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none" }, "OK"),
                react_1.default.createElement("button", { onClick: function () { return handleUserChoice(false); }, className: "px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none" }, "Cancel"))))));
};
exports.default = TextSimplifier;
