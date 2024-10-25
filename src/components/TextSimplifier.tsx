import React, { useState, useCallback } from "react";
import { Upload, Book, X, Info, RefreshCw, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Slider } from "./ui/slider";
import axios from "axios";

const TextSimplifier = () => {
  const [inputMethod, setInputMethod] = useState("text");
  const [inputText, setInputText] = useState("");
  const [audience, setAudience] = useState("general");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [sidebarEntries, setSidebarEntries] = useState([]);
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const audienceOptions = [
    { value: "scientists", label: "Scientists and Researchers" },
    { value: "students", label: "Students and Academics" },
    { value: "industry", label: "Industry Professionals" },
    { value: "journalists", label: "Journalists and Media Professionals" },
    { value: "general", label: "General Public (Non-Expert)" },
  ];

  // const simplifyText = async () => {
  //   setIsLoading(true);
  //   setError('');
  //   try {

  //     await new Promise(resolve => setTimeout(resolve, 1500));
  //     setSimplifiedText(
  //       `This is a simplified version of your text for ${
  //         audienceOptions.find(opt => opt.value === audience).label
  //       }. [Sample output would be here based on LLM response]`
  //     );
  //   } catch (err) {
  //     setError('Failed to simplify text. Please try again.');
  //   }
  //   setIsLoading(false);
  // };

  const simplifyText = async () => {
    setIsLoading(true);
    setError("");
    try {
      const audienceLabel = audienceOptions.find(
        (opt) => opt.value === audience
      ).label;
      const response = await axios.post("http://localhost:7171/simplify", {
        text: inputText,
        audience: audienceLabel,
      });

      setSimplifiedText(response.data.simplifiedText);
    } catch (err) {
      setError("Failed to simplify text. Please try again.");
    }
    setIsLoading(false);
  };

  function removeNonAlphabetic(str) {
    return str.replace(/[^a-zA-Z\s]/g, ""); // Remove non-alphabetic characters
  }

  const handleWordClick = useCallback(
    async (word_uncleaned) => {
      setIsSidebarOpen(true); // Open sidebar when a word is clicked
      const word = removeNonAlphabetic(word_uncleaned).toLowerCase();
      console.log("Word clicked:", word);
      if (!sidebarEntries.find((entry) => entry.word === word)) {
        try {
          const definitionResponse = await axios.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
          );
          const definition =
            definitionResponse.status === 200
              ? definitionResponse.data[0].meanings[0].definitions[0].definition
              : "Definition not found.";

          const synonymResponse = await axios.get(
            `https://api.datamuse.com/words?rel_syn=${word}`
          );
          const synonyms =
            synonymResponse.status === 200 && synonymResponse.data.length > 0
              ? synonymResponse.data.map((syn) => syn.word)
              : ["Synonym not found."];

          setSidebarEntries((prev) => [
            ...prev,
            {
              word,
              definition,
              synonyms,
            },
          ]);
        } catch (error) {
          console.error("Error fetching word info:", error);
          setSidebarEntries((prev) => [
            ...prev,
            {
              word,
              definition: "Error fetching definition.",
              synonyms: ["Error fetching synonyms."],
            },
          ]);
        }
      }
    },
    [sidebarEntries]
  );

  const removeSidebarEntry = (word) => {
    setSidebarEntries((prev) => prev.filter((entry) => entry.word !== word));
  };

  const sendRating = async () => {
    try {
      await axios.post('http://localhost:7171/rating', null, {
        params: { rating }
      });
      alert('Rating sent successfully!');
    } catch (error) {
      console.error('Error sending rating:', error);
      alert('Failed to send rating.');
    }
  };
  
  const containerStyle = {
    width: "32rem",
    // marginLeft: isSidebarOpen ? '0': '32rem'
    marginLeft: "auto",
  };
  return (
    <div className="flex h-screen max-h-screen">
      <div
        className="flex-1 p-4 overflow-auto"
        id="main-container"
        style={containerStyle}
      >
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Text Simplification Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button
                variant={inputMethod === "text" ? "default" : "outline"}
                onClick={() => setInputMethod("text")}
              >
                <Book className="mr-2 h-4 w-4" />
                Text Input
              </Button>
              <Button
                variant={inputMethod === "upload" ? "default" : "outline"}
                onClick={() => setInputMethod("upload")}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>

            {inputMethod === "text" ? (
              <textarea
                className="w-full h-32 p-2 border rounded-md mb-4 bg-blue-50 text-gray-800 placeholder-gray-400 border-blue-200 focus:border-blue-400 focus:ring-blue-300 focus:ring-2 focus:outline-none"
                placeholder="Enter text to simplify..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            ) : (
              <div className="border-2 border-dashed rounded-md p-8 text-center mb-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>Drag and drop a file or click to upload</p>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>
            )}

            <div className="mb-4">
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  {audienceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={simplifyText}
              disabled={isLoading || !inputText}
              className="w-full"
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Simplify Text
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {simplifiedText && (
          <Card>
            <CardHeader>
              <CardTitle>Simplified Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-md mb-4">
                {simplifiedText.split(" ").map((word, index) => (
                  <span
                    key={index}
                    className="hover:bg-blue-100 cursor-pointer px-1 rounded"
                    onClick={() => handleWordClick(word)}
                  >
                    {word}{" "}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <p className="mb-2">How helpful was this simplification?</p>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[rating]}
                    onValueChange={(value) => setRating(value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-64"
                  />
                  <span className="font-bold">{rating}/10</span>
                  <Button onClick={sendRating} className="ml-4">
                  Send Rating
                </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 z-50"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Info className="h-6 w-6" />
        )}
      </button>

      {/* Retractable Sidebar */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-gray-50 p-4 border-l shadow-lg overflow-auto transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h3 className="font-bold mb-4">Definitions & Synonyms</h3>
        {sidebarEntries.map((entry) => (
          <div
            key={entry.word}
            className="mb-4 bg-white p-3 rounded-md shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <strong>{entry.word}</strong>
              <button
                onClick={() => removeSidebarEntry(entry.word)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm mb-2">
              <strong>Definition:</strong>{" "}
              {entry.definition.split(" ").map((word, index) => (
                <span
                  key={index}
                  className="hover:bg-blue-100 cursor-pointer px-1 rounded"
                  onClick={() => handleWordClick(word)}
                >
                  {word}{" "}
                </span>
              ))}
            </p>
            <p className="text-sm">
              <strong>Synonyms:</strong>{" "}
              {entry.synonyms.map((synonym, index) => (
                <span
                  key={index}
                  className="hover:bg-blue-100 cursor-pointer px-1 rounded"
                  onClick={() => handleWordClick(synonym)}
                >
                  {synonym}{" "}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextSimplifier;
