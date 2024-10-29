import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Sidebar from "./ui/Sidebar";
import { audienceOptions, BASE_URL } from "../utils/constants";
import InputSection from "./InputSection";
import AudienceSelector from "./TargetAudience";
import SimplifiedText from "./OutputSection";
import RatingSection from "./RatingSection";
import { Alert } from "./ui/alert";

const TextSimplifier = () => {
  const [inputMethod, setInputMethod] = useState("text");
  const [inputText, setInputText] = useState("");
  const [audience, setAudience] = useState("general");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedSentence, setSelectedSentence] = useState("");
  const [furtherSimplifiedText, setFurtherSimplifiedText] = useState("");
  const [sidebarEntries, setSidebarEntries] = useState([]);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [synonymToReplace, setSynonymToReplace] = useState(null);
  // const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);



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
      console.log(error)
      setError(`Failed to simplify text. ${error}.`);
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

      const response = await axios.post(`${BASE_URL}/simplify`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSimplifiedText(response.data.simplifiedText);
    } catch {
      console.log(error)
      setError(`Failed to simplify text. ${error}.`);
    }
    setIsLoading(false);
  };

  const handleWordClick = useCallback(
    async (word) => {
      if (!isExpertMode || isLoading) return;

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
    [sidebarEntries, isLoading]
  );

  const removeSidebarEntry = (word) => {
    setSidebarEntries((prev) => prev.filter((entry) => entry.word !== word));
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const handleFeedbackSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/rating`, null, { params: { rating, feedback } });
      alert("Rating and feedback sent successfully!");
      setFeedback(''); // Clear feedback after submission
    } catch {
      alert("Failed to send rating.");
    }
  };

  // New useEffect to handle word replacement
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
  }, [selectedWord, synonymToReplace]);

  

  // Function triggered when a synonym is clicked
  const handleSynonymClick = (synonym) => {
    setSynonymToReplace(synonym);
  };

  // Handle sentence double-click
  const handleSentenceClick = (sentence) => {
    if (!isExpertMode) return;
    setSelectedSentence(sentence);
    handleFurtherSimplification(sentence);
  };

  // Function to further simplify the selected sentence
  const handleFurtherSimplification = async (sentence) => {
    if (!sentence) return;

    setIsLoading(true);
    setError("");
    try {
      const audienceLabel = audienceOptions.find((opt) => opt.value === audience).label;
      const response = await axios.post(`${BASE_URL}/simplify`, {
        text: sentence,
        audience: audienceLabel,
      });
      setFurtherSimplifiedText(response.data.simplifiedText); // Set the further simplified text
    } catch {
      console.log(error)
      setError(`Failed to simplify the selected sentence. ${error}.`);
    }
    setIsLoading(false);
  };

  // Function to replace the selected sentence with the further simplified sentence
  const handleUpdateSimplifiedText = () => {
    if (!selectedSentence || !furtherSimplifiedText) return;

    const updatedText = simplifiedText.replace(
      new RegExp(`\\b${selectedSentence}\\b`),
      furtherSimplifiedText
    );
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
              setInputMethod={setInputMethod}
              inputText={inputText}
              setInputText={setInputText}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              handleUploadFile={handleUploadFile}
              handleSimplifyText={handleSimplifyText}
              isLoading={isLoading}
            />

            <AudienceSelector audience={audience} setAudience={setAudience} />

            {error && <Alert variant="destructive">{error}</Alert>}
            {simplifiedText && (
              <>
                <SimplifiedText
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
                    onClick={() => setIsExpertMode(!isExpertMode)}
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
                    <p>In Expert Mode, click on words for definitions and synonyms, and double-click sentences for further simplification.</p>
                  </div>
                )}


                {/* Further Simplification Section */}
                {isExpertMode && furtherSimplifiedText && (
                  <div className="p-4 bg-green-50 rounded-md mt-4">
                    <h3 className="text-lg font-semibold">Further Simplified Sentence:</h3>
                    <p>{furtherSimplifiedText}</p>
                    <Button onClick={handleUpdateSimplifiedText} className="mt-2">
                      Update Simplified Text
                    </Button>
                  </div>
                )}

                {/* Conditionally render RatingSection when simplifiedText exists */}
                <RatingSection
                  rating={rating}
                  setRating={setRating}
                  handleFeedbackSubmit={handleFeedbackSubmit}
                  feedback={feedback}
                  setFeedback={setFeedback}
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
        handleSynonymClick={handleSynonymClick}
        setSelectedWord={setSelectedWord}
      />
    </div>
  );



};

export default TextSimplifier;
