import React from "react";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";

const RatingSection = ({ feedback, setFeedback, handleFeedbackSubmit }) => (
  <div className="mt-4">
    <p className="mb-2">How helpful was this simplification?</p>
    <div className="flex items-center gap-4">
      <Slider
        value={[feedback.rating]}
        onValueChange={(val) => setFeedback({ ...feedback, rating: val[0] })}
        max={10}
        min={1}
        step={1}
      />
      <span className="font-bold">{feedback.rating}/10</span>
    </div>
    <textarea
      className="w-full h-32 p-2 border rounded-md bg-blue-50 text-gray-800"
      rows={3} 
      placeholder="Enter your feedback here..."
      value={feedback.text}
      onChange={(e) => setFeedback({ ...feedback, text: e.target.value })}
    />
    <Button onClick={handleFeedbackSubmit} className="w-full mt-4">
      Submit Feedback
    </Button>
  </div>
);

export default RatingSection;
