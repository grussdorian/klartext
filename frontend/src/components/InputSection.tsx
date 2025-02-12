import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Upload, Book, RefreshCw, Globe } from "lucide-react";
import AudienceSelector from "./TargetAudience";
import { OpenAILanguage } from "../types";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
} from "./ui/select";

const InputSection = ({
  inputMethod,
  setInputMethod,
  inputText,
  setInputText,
  inputFile,
  setInputFile,
  handleUploadFile,
  handleSimplifyText,
  handleSimplifyWebpage,
  isLoading,
  inputWebpage,
  setInputWebpage,
  audience,
  setAudience,
  outputLanguage,
  setOutputLanguage,
  t
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  // Convert enum to array of objects
  const languageOptions = Object.entries(OpenAILanguage).map(([name, code]) => ({
    label: name,
    value: code,
  }));

  // Filter languages based on search term
  const filteredLanguages = languageOptions.filter((lang) =>
    lang.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchTerm]); // Triggered when dropdown opens

  return (
    <>
      <div className="mb-4">
        <div className="flex gap-4 mb-4 justify-center">
          {["text", "upload", "webpage"].map((method) => (
            <Button
              key={method}
              variant={inputMethod === method ? "default" : "outline"}
              onClick={() => setInputMethod(method)}
            >
              {method === "text" ? (
                <Book className="mr-2 h-4 w-4" />
              ) : method === "upload" ? (
                <Upload className="mr-2 h-4 w-4" />
              ) : (
                <Globe className="mr-2 h-4 w-4" />
              )}
              {method === "text"
                ? t("Text")
                : method === "upload"
                  ? t("Document")
                  : t("Link")}
            </Button>
          ))}
        </div>

        {inputMethod === "text" ? (
          <>
            <textarea
              className="w-full h-32 p-2 border rounded-md bg-blue-50 text-gray-800"
              placeholder={t("Enter text to simplify...")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </>
        ) : inputMethod === "upload" ? (
          <>
            <div className="border-2 border-dashed rounded-md p-8 text-center bg-gray-50">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-gray-700"
              >
                <Upload className="h-8 w-8 mb-2 text-gray-500" />
                <span className="text-sm font-medium">{t("Drag & Drop or Click to Upload")}</span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => setInputFile(e.target.files[0])}
                />
              </label>
              {inputFile && (
                <p className="mt-2 text-sm text-gray-600">
                  {t("Selected File")}: <span className="font-semibold">{inputFile.name}</span>
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-blue-50 text-gray-800"
              placeholder={t("Enter webpage URL...")}
              value={inputWebpage}
              onChange={(e) => setInputWebpage(e.target.value)}
            />
          </>
        )}
      </div>

      {/* Selectors (Audience & Language) */}
      <div className="flex gap-4 mb-4 justify-center">
        <AudienceSelector audience={audience} setAudience={setAudience} t={t} />

        <Select onValueChange={setOutputLanguage}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Output Language" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <input
                ref={searchInputRef}
                placeholder="Search language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md bg-blue-50 text-gray-800"
              />
            </div>
            <SelectGroup>
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">{t("No results found")}</div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button Below the Selectors */}
      <div className="flex justify-center">
        <Button
          onClick={() => {
            if (inputMethod === "text") handleSimplifyText();
            else if (inputMethod === "upload") handleUploadFile();
            else handleSimplifyWebpage();
          }}
          disabled={isLoading || (!inputText && !inputFile && !inputWebpage)}
          className="w-72 mt-4"
        >
          {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          {inputMethod === "text"
            ? t("Simplify Text")
            : inputMethod === "upload"
              ? t("Simplify Document")
              : t("Simplify Webpage")}
        </Button>
      </div>
    </>
  );
};

export default InputSection;
