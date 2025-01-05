// Language: typescript
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert } from "./ui/alert";
import { Button } from "./ui/button";
import Sidebar from "./ui/Sidebar";

import { audienceOptions, BASE_URL } from "../utils/constants";

import { Feedback } from "../types"

import InputSection from "./InputSection";
import AudienceSelector from "./TargetAudience";
import OutputSection from "./OutputSection";
import RatingSection from "./RatingSection";

const TextSimplifier = () => {
  //Input
  const [inputMethod, setInputMethod] = useState("text");
  const [inputText, setInputText] = useState("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputWebpage, setInputWebpage] = useState("")
  const [audience, setAudience] = useState("general");

  //Output
  const [simplifiedText, setSimplifiedText] = useState("");

  //Expert Mode
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedSentence, setSelectedSentence] = useState("");
  const [furtherSimplifiedText, setFurtherSimplifiedText] = useState("");
  const [currentSynonym, setCurrentSynonym] = useState("");
  const [synonymToReplace, setSynonymToReplace] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  //Sidebar
  const [sidebarEntries, setSidebarEntries] = useState<
    { word: string; definition: string; synonyms: string[] }[]
  >([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //Feedback
  const defaultFeedback = { rating: 5, text: "" };
  const [feedback, setFeedback] = useState<Feedback>(defaultFeedback)

  // Misc
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSimplifyText = async () => {
    setIsLoading(true);
    setError("");
    try {
      const audienceLabel = audienceOptions.find(
        (opt) => opt.value === audience
      )?.label;
      const response = await axios.post(`${BASE_URL}/simplify`, {
        text: inputText,
        audience: audienceLabel,
      });
      setSimplifiedText(response.data.simplifiedText);
    } catch (err: any) {
      console.log(err);
      setError(`Failed to simplify text. ${err.response.data}`);
    }
    setIsLoading(false);
  };

  const handleUploadFile = async () => {
    if (!inputFile) return;
    setIsLoading(true);
    setError("");
    try {
      const audienceLabel = audienceOptions.find(
        (opt) => opt.value === audience
      )?.label;
      const formData = new FormData();
      formData.append("file", inputFile);
      formData.append("audience", audienceLabel || "");

      const response = await axios.post(`${BASE_URL}/simplify`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSimplifiedText(response.data.simplifiedText);
    } catch (err: any) {
      console.log(err);
      setError(`Failed to simplify text. ${err.response.data}`);
    }
    setIsLoading(false);
  };

  const handleSimplifyWebpage = async () => {
    setIsLoading(true);
    setError("");
    try {
      const audienceLabel = audienceOptions.find(
        (opt) => opt.value === audience
      )?.label;
  
      if (!inputWebpage) {
        setError("Please enter a valid URL.");
        setIsLoading(false);
        return;
      }
  
      const response = await axios.post(`${BASE_URL}/simplify`, {
        url: inputWebpage,
        audience: audienceLabel,
      });
  
      setSimplifiedText(response.data.simplifiedText);
    } catch (err: any) {
      console.log(err);
      setError(`Failed to simplify URL. ${err.response?.data || "An error occurred."}`);
    }
    setIsLoading(false);
  };
  

  const handleWordClick = useCallback(
    async (word: string) => {
      if (!isExpertMode || isLoading) return;

      setIsSidebarOpen(true);
      const cleanWord = word.replace(/[^a-zA-Z\s]/g, "").toLowerCase();

      // Check if the word already exists in sidebarEntries to prevent duplicates
      if (sidebarEntries.some((entry) => entry.word === cleanWord)) {
        return;
      }

      try {
        const [{ data: definitionData }, { data: synonymsData }] =
          await Promise.all([
            axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`),
            axios.get(`https://api.datamuse.com/words?rel_syn=${cleanWord}`),
          ]);

        const definition =
          definitionData[0]?.meanings[0]?.definitions[0]?.definition ||
          "Definition not found.";
        const synonyms = synonymsData.length
          ? synonymsData.map((syn: any) => syn.word)
          : ["No synonyms found."];

        setSidebarEntries((prev) => [
          ...prev,
          { word: cleanWord, definition, synonyms },
        ]);
      } catch (err: any) {
        setSidebarEntries((prev) => [
          ...prev,
          {
            word: cleanWord,
            definition: "Error fetching definition.",
            synonyms: ["Error fetching synonyms."],
          },
        ]);
      }
    },
    [sidebarEntries, isExpertMode, isLoading]
  );

  const removeSidebarEntry = (word: string) => {
    setSidebarEntries((prev) => prev.filter((entry) => entry.word !== word));
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const toggleExpertMode = () => {
    setFurtherSimplifiedText("");
    setSelectedSentence("");
    setIsExpertMode((prev) => !prev);
  };

  const handleFeedbackSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/feedback`, feedback);
      alert("Rating and feedback sent successfully!");
      setFeedback(defaultFeedback); // Clear feedback after submission
    } catch {
      alert("Failed to send rating.");
    }
  };

  useEffect(() => {
    // Reset states when the input method changes
    setInputText(""); // Clear any entered text
    setInputFile(null); // Remove any uploaded file
    setInputWebpage(""); // Clear any entered webpage URL
    setSimplifiedText(""); // Clear any previously simplified text
    setFurtherSimplifiedText(""); // Clear any further simplifications
    setSelectedSentence(""); // Clear selected sentence for further simplification
    setError(""); // Clear any errors from the previous input method
    setSidebarEntries([]); // Clear any sidebar entries

    // Optionally, reset more states as needed for your app
  }, [inputMethod]);

  // Handle word replacement
  useEffect(() => {
    if (selectedWord && synonymToReplace) {
      const highlightedText = simplifiedText.replace(
        new RegExp(`\\b${selectedWord}\\b`, "g"),
        synonymToReplace
      );

      setSimplifiedText(highlightedText);
      setSelectedWord(null);
      setSynonymToReplace(null);
    }
  }, [selectedWord, synonymToReplace, simplifiedText]);

  // Function to replace the selected word with a synonym based on user choice
  const replaceWord = (synonym: string, choice: boolean) => {
    if (choice) {
      setSynonymToReplace(synonym);
    }
    // If canceled, do nothing
  };

  // Function triggered when a synonym is clicked
  const handleSynonymClick = (
    synonym: string,
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    const popupWidth = 250; // Estimated width of the popup in pixels
    const popupHeight = 150; // Estimated height of the popup in pixels
    const margin = 10; // Margin from the viewport edges

    let x = event.clientX;
    let y = event.clientY;

    // Adjust X position if popup goes beyond the right edge
    if (x + popupWidth > window.innerWidth) {
      x = window.innerWidth - popupWidth - margin;
    }

    // Adjust Y position if popup goes beyond the bottom edge
    if (y + popupHeight > window.innerHeight) {
      y = window.innerHeight - popupHeight - margin;
    }

    setPopupPosition({ x, y });
    setCurrentSynonym(synonym);
    setPopupVisible(true);
  };

  // Function to handle user's choice in the popup
  const handleUserChoice = (replace: boolean) => {
    setPopupVisible(false);
    replaceWord(currentSynonym, replace);
  };

  // Handle sentence double-click
  const handleSentenceClick = (sentence: string) => {
    if (!isExpertMode) return;
    setSelectedSentence(sentence);
    handleFurtherSimplification(sentence);
  };

  // Function to further simplify the selected sentence
  const handleFurtherSimplification = async (sentence: string) => {
    if (!sentence) return;

    setIsLoading(true);
    setError("");
    try {
      const audienceLabel = audienceOptions.find(
        (opt) => opt.value === audience
      )?.label;
      const response = await axios.post(`${BASE_URL}/simplify`, {
        text: sentence,
        audience: audienceLabel,
      });
      setFurtherSimplifiedText(response.data.simplifiedText); // Set the further simplified text
    } catch (err: any) {
      console.log(err);
      setError(`Failed to simplify the selected sentence. ${err.response.data}.`);
    }
    setIsLoading(false);
  };

  const removeDoublePeriods = (text: string): string => {
    return text.replace(/\.{2,}/g, '.');
  };

  // Function to replace the selected sentence with the further simplified sentence
  const handleUpdateSimplifiedText = () => {
    if (!selectedSentence || !furtherSimplifiedText) return;

    let updatedText = simplifiedText.replace(
      new RegExp(`\\b${selectedSentence}\\b`),
      furtherSimplifiedText
    );
    updatedText = removeDoublePeriods(updatedText);
    setSimplifiedText(updatedText); // Update the main simplified text
    setFurtherSimplifiedText(""); // Clear the further simplified text
    setSelectedSentence(""); // Clear the selected sentence
  };

  return (
    <div className="flex justify-center items-start"> {/* Ensure content is centered */}
      <div className="max-w-3xl w-full mx-4 p-4"> {/* Adjust max-width as needed */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Klartext: AI-based Translation of Websites Into Plain Language</CardTitle>
          </CardHeader>
          <CardContent>
            <InputSection
              inputMethod={inputMethod}
              setInputMethod={(method) => setInputMethod(method)}
              inputText={inputText}
              setInputText={setInputText}
              inputFile={inputFile}
              setInputFile={setInputFile}
              handleUploadFile={handleUploadFile}
              inputWebpage={inputWebpage}
              setInputWebpage={setInputWebpage}
              handleSimplifyWebpage={handleSimplifyWebpage}
              handleSimplifyText={handleSimplifyText}
              isLoading={isLoading}
            />

            <AudienceSelector audience={audience} setAudience={setAudience} />

            {error && <Alert variant="destructive">{error}</Alert>}
            {simplifiedText && (
              <>
                <OutputSection
                  simplifiedText={simplifiedText}
                  selectedWord={selectedWord}
                  handleWordClick={handleWordClick}
                  selectedSentence={selectedSentence}
                  handleSentenceClick={handleSentenceClick}
                  clickable={isExpertMode}
                />

                {/* Show Advanced Options Button */}
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-gray-700 font-medium">Expert Mode</span>
                  <div
                    onClick={toggleExpertMode}
                    className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors ${isExpertMode ? "bg-blue-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isExpertMode ? "translate-x-6" : ""
                        }`}
                    ></span>
                  </div>
                </div>

                {isExpertMode && (
                  <div className="text-gray-600 mt-2">
                    <p>
                      In Expert Mode, click on words for definitions and synonyms, and double-click
                      sentences for further simplification.
                    </p>
                  </div>
                )}

                {/* Further Simplification Section */}
                {isExpertMode && furtherSimplifiedText && (
                  <div className="p-4 bg-green-50 rounded-md mt-4">
                    <h3 className="text-lg font-semibold">Further Simplified Sentence:</h3>
                    <p>{furtherSimplifiedText}</p>
                    <Button onClick={handleUpdateSimplifiedText} className="mt-2">
                      Replace Selected Sentence
                    </Button>
                  </div>
                )}

                {/* Conditionally render RatingSection when simplifiedText exists */}
                <RatingSection

                  feedback={feedback}
                  setFeedback={setFeedback}
                  handleFeedbackSubmit={handleFeedbackSubmit}
                />
              </>
            )}

          </CardContent>
        </Card>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        sidebarEntries={sidebarEntries}
        removeSidebarEntry={removeSidebarEntry}
        handleWordClick={handleWordClick}
        handleSynonymClick={(synonym: string, event: React.MouseEvent<HTMLSpanElement>) => handleSynonymClick(synonym, event)}
        setSelectedWord={setSelectedWord}
      />

      {popupVisible && (
        <div
          className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50"
          style={{
            top: popupPosition.y,
            left: popupPosition.x,
            width: "250px", // Fixed width to match popupWidth in handler
            boxSizing: "border-box",
          }}
        >
          <p className="mb-4 text-gray-700">
            Replace all occurrences of this word with {" "}
            <span className="font-semibold">"{currentSynonym}"</span>?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => handleUserChoice(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              OK
            </button>
            <button
              onClick={() => handleUserChoice(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextSimplifier;