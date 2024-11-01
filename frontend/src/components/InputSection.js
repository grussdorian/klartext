"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var button_1 = require("./ui/button");
var lucide_react_1 = require("lucide-react");
var InputSection = function (_a) {
    var inputMethod = _a.inputMethod, setInputMethod = _a.setInputMethod, inputText = _a.inputText, setInputText = _a.setInputText, uploadedFile = _a.uploadedFile, setUploadedFile = _a.setUploadedFile, handleUploadFile = _a.handleUploadFile, handleSimplifyText = _a.handleSimplifyText, isLoading = _a.isLoading;
    return (react_1.default.createElement("div", { className: "mb-4" },
        react_1.default.createElement("div", { className: "flex gap-4 mb-4 justify-center" }, ["text", "upload"].map(function (method) { return (react_1.default.createElement(button_1.Button, { key: method, variant: inputMethod === method ? "default" : "outline", onClick: function () { return setInputMethod(method); } },
            method === "text" ? react_1.default.createElement(lucide_react_1.Book, { className: "mr-2 h-4 w-4" }) : react_1.default.createElement(lucide_react_1.Upload, { className: "mr-2 h-4 w-4" }),
            method === "text" ? "Text Input" : "Upload Document")); })),
        inputMethod === "text" ? (react_1.default.createElement("textarea", { className: "w-full h-32 p-2 border rounded-md bg-blue-50 text-gray-800", placeholder: "Enter text to simplify...", value: inputText, onChange: function (e) { return setInputText(e.target.value); } })) : (react_1.default.createElement("div", { className: "border-2 border-dashed rounded-md p-8 text-center bg-gray-50" },
            react_1.default.createElement("label", { htmlFor: "file-upload", className: "flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-gray-700" },
                react_1.default.createElement(lucide_react_1.Upload, { className: "h-8 w-8 mb-2 text-gray-500" }),
                react_1.default.createElement("span", { className: "text-sm font-medium" }, "Drag & Drop or Click to Upload"),
                react_1.default.createElement("input", { id: "file-upload", type: "file", className: "hidden", onChange: function (e) { return setUploadedFile(e.target.files[0]); } })),
            uploadedFile && (react_1.default.createElement("p", { className: "mt-2 text-sm text-gray-600" },
                "Selected File: ",
                react_1.default.createElement("span", { className: "font-semibold" }, uploadedFile.name))))),
        react_1.default.createElement(button_1.Button, { onClick: uploadedFile ? handleUploadFile : handleSimplifyText, disabled: isLoading || !(inputText || uploadedFile), className: "w-full mt-4" },
            isLoading && react_1.default.createElement(lucide_react_1.RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Simplify Text")));
};
exports.default = InputSection;
