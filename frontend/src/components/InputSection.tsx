import React from "react";
import { Button } from "./ui/button";
import { Upload, Book, RefreshCw, Globe } from "lucide-react";

const InputSection = ({
  inputMethod,
  setInputMethod,
  inputText,
  setInputText,
  uploadedFile,
  setUploadedFile,
  handleUploadFile,
  handleSimplifyText,
  isLoading,
  webpageUrl,
  setWebpageUrl,
}) => (
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
            ? "Text Input"
            : method === "upload"
            ? "Upload Document"
            : "Webpage"}
        </Button>
      ))}
    </div>

    {inputMethod === "text" ? (
      <>
        <textarea
          className="w-full h-32 p-2 border rounded-md bg-blue-50 text-gray-800"
          placeholder="Enter text to simplify..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button
          onClick={handleSimplifyText}
          disabled={isLoading || !inputText}
          className="w-full mt-4"
        >
          {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          Simplify Text
        </Button>
      </>
    ) : inputMethod === "upload" ? (
      <>
        <div className="border-2 border-dashed rounded-md p-8 text-center bg-gray-50">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <Upload className="h-8 w-8 mb-2 text-gray-500" />
            <span className="text-sm font-medium">Drag & Drop or Click to Upload</span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => setUploadedFile(e.target.files[0])}
            />
          </label>
          {uploadedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected File: <span className="font-semibold">{uploadedFile.name}</span>
            </p>
          )}
        </div>
        <Button
          onClick={handleUploadFile}
          disabled={isLoading || !uploadedFile}
          className="w-full mt-4"
        >
          {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          Simplify Document
        </Button>
      </>
    ) : (
      <>
        <input
          type="text"
          className="w-full p-2 border rounded-md bg-blue-50 text-gray-800"
          placeholder="Enter webpage URL here..."
          value={webpageUrl}
          onChange={(e) => setWebpageUrl(e.target.value)}
        />
        <Button
          onClick={handleSimplifyText}
          disabled={isLoading || !webpageUrl}
          className="w-full mt-4"
        >
          {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          Simplify Webpage
        </Button>
      </>
    )}
  </div>
);

export default InputSection;
