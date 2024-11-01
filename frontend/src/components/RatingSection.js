"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var slider_1 = require("./ui/slider");
var button_1 = require("./ui/button");
var RatingSection = function (_a) {
    var rating = _a.rating, setRating = _a.setRating, feedback = _a.feedback, setFeedback = _a.setFeedback, handleFeedbackSubmit = _a.handleFeedbackSubmit;
    return (react_1.default.createElement("div", { className: "mt-4" },
        react_1.default.createElement("p", { className: "mb-2" }, "How helpful was this simplification?"),
        react_1.default.createElement("div", { className: "flex items-center gap-4" },
            react_1.default.createElement(slider_1.Slider, { value: [rating], onValueChange: function (val) { return setRating(val[0]); }, max: 10, min: 1, step: 1 }),
            react_1.default.createElement("span", { className: "font-bold" },
                rating,
                "/10")),
        react_1.default.createElement("textarea", { className: "w-full h-32 p-2 border rounded-md bg-blue-50 text-gray-800", rows: 3, placeholder: "Enter your feedback here...", value: feedback, onChange: function (e) { return setFeedback(e.target.value); } }),
        react_1.default.createElement(button_1.Button, { onClick: handleFeedbackSubmit, className: "w-full mt-4" }, "Submit Feedback")));
};
exports.default = RatingSection;
