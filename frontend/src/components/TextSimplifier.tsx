import React, { useState, useCallback, useEffect } from "react";
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
import Sidebar from "./ui/Sidebar";
import axios from "axios";

const audienceOptions = [
  { value: "scientists", label: "Scientists and Researchers" },
  { value: "students", label: "Students and Academics" },
  { value: "industry", label: "Industry Professionals" },
  { value: "journalists", label: "Journalists and Media Professionals" },
  { value: "general", label: "General Public (Non-Expert)" },
];

const BASE_URL = "http://localhost:7171";

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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [synonymToReplace, setSynonymToReplace] = useState(null);



  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleFileChange = (event) => setUploadedFile(event.target.files[0]);

  const handleSimplifyText = async () => {
    setIsLoading(true);
    setError("");
    try {
      const audienceLabel = audienceOptions.find((opt) => opt.value === audience).label;
      const response = await axios.post(`${BASE_URL}/simplify`, {
        text: inputText,
        audience: audienceLabel,
      });
      setSimplifiedText(response.data.simplifiedText);
    } catch {
      setError("Failed to simplify text. Please try again.");
    }
    setIsLoading(false);
  };

  const handleUploadFile = async () => {
    setIsLoading(true);
    setError("");
    try {
      const audienceLabel = audienceOptions.find((opt) => opt.value === audience).label;
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("audience", audienceLabel);

      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSimplifiedText(response.data.simplifiedText);
    } catch {
      setError("Failed to simplify text. Please try again.");
    }
    setIsLoading(false);
  };

  const handleWordClick = useCallback(
    async (word) => {
      setIsSidebarOpen(true);
      const cleanWord = word.replace(/[^a-zA-Z\s]/g, "").toLowerCase();

      if (!sidebarEntries.some((entry) => entry.word === cleanWord)) {
        try {
          const [{ data: definitionData }, { data: synonymsData }] = await Promise.all([
            axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`),
            axios.get(`https://api.datamuse.com/words?rel_syn=${cleanWord}`),
          ]);

          const definition = definitionData[0]?.meanings[0]?.definitions[0]?.definition || "Definition not found.";
          const synonyms = synonymsData.length ? synonymsData.map((syn) => syn.word) : ["No synonyms found."];

          setSidebarEntries((prev) => [...prev, { word: cleanWord, definition, synonyms }]);
        } catch {
          setSidebarEntries((prev) => [
            ...prev,
            { word: cleanWord, definition: "Error fetching definition.", synonyms: ["Error fetching synonyms."] },
          ]);
        }
      }
    },
    [sidebarEntries]
  );

  const removeSidebarEntry = (word) => {
    setSidebarEntries((prev) => prev.filter((entry) => entry.word !== word));
  };

  const handleRatingSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/rating`, null, { params: { rating } });
      alert("Rating sent successfully!");
    } catch {
      alert("Failed to send rating.");
    }
  };

  const renderInputSection = () => (
    <div className="mb-4">
      {inputMethod === "text" ? (
        <textarea
          className="w-full h-32 p-2 border rounded-md bg-blue-50 text-gray-800"
          placeholder="Enter text to simplify..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      ) : (
        <div className="border-2 border-dashed rounded-md p-8 text-center">
          <input type="file" onChange={handleFileChange} />
          <Button onClick={handleUploadFile} disabled={isLoading || !uploadedFile} className="mt-4">
            {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
            Upload Document
          </Button>
        </div>
      )}
    </div>
  );

  //   if (selectedWord) {
  //     const updatedText = simplifiedText.replace(new RegExp(`\\b${selectedWord}\\b`, "g"), synonym);
  //     console.log(selectedWord)
  //     console.log(updatedText)
  //     setSimplifiedText(updatedText);
  //     setSelectedWord(null);
  //   }

    // New useEffect to handle word replacement
    useEffect(() => {
      if (selectedWord && synonymToReplace) {
        setSimplifiedText((prevText) =>
          prevText.replace(new RegExp(`\\b${selectedWord}\\b`, "g"), synonymToReplace)
        );
        setSelectedWord(null); // Reset to allow for further replacements
        setSynonymToReplace(null); // Clear after replacement
      }
    }, [selectedWord, synonymToReplace]);
  
    // Function triggered when a synonym is clicked
    const handleSynonymClick = (synonym) => {
      setSynonymToReplace(synonym);
    };

  return (
    <div className="flex h-screen max-h-screen">
      <div className="flex-1 p-4 overflow-auto" style={{ width: "32rem", marginLeft: "auto" }}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Text Simplification Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              {["text", "upload"].map((method) => (
                <Button
                  key={method}
                  variant={inputMethod === method ? "default" : "outline"}
                  onClick={() => setInputMethod(method)}
                >
                  {method === "text" ? <Book className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                  {method === "text" ? "Text Input" : "Upload Document"}
                </Button>
              ))}
            </div>

            {renderInputSection()}

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

            <Button onClick={handleSimplifyText} disabled={isLoading || !inputText} className="w-full">
              {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
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
                  <span key={index} className="hover:bg-blue-100 cursor-pointer" onClick={() => handleWordClick(word)}>
                    {word}{" "}
                  </span>
                ))}
              </div>

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
            </CardContent>
          </Card>
        )}
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        sidebarEntries={sidebarEntries}
        removeSidebarEntry={removeSidebarEntry}
        handleWordClick={handleWordClick}
        handleSynonymClick={handleSynonymClick}
        setSelectedWord={setSelectedWord}
      />

    </div>
  );
};

export default TextSimplifier;
