import React from "react";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";

const RatingSection = ({ rating, setRating, handleRatingSubmit }) => (
  <div className="mt-4">
    <p className="mb-2">How helpful was this simplification?</p>
    <div className="flex items-center gap-4">
      <Slider value={[rating]} onValueChange={(val) => setRating(val[0])} max={10} min={1} step={1} />
      <span className="font-bold">{rating}/10</span>
      <Button onClick={handleRatingSubmit} className="ml-4">
        Send Rating
      </Button>
    </div>
  </div>
);

export default RatingSection;
