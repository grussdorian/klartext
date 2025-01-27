import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { audienceOptions } from "../utils/constants";

const TargetAudience = ({ audience, setAudience, t }) => (
  <Select value={audience} onValueChange={setAudience}>
    <SelectTrigger>
      <SelectValue placeholder={t("Select target audience")} />
    </SelectTrigger>
    <SelectContent>
      {audienceOptions.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {t(option.label)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default TargetAudience;
