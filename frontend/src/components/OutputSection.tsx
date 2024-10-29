import React from "react";

const SimplifiedText = ({ simplifiedText, selectedSentence, selectedWord, handleWordClick, handleSentenceClick, clickable }) => {

  const handleWClick = (word) => {
    if (clickable) {
      handleWordClick(word);
    }
  };

  const handleSClick = (sentence) => {
    if (clickable) {
      handleSentenceClick(sentence);
    }
  };

  // Remove trailing period from simplifiedText if it exists
  const sanitizedText = simplifiedText.trim().endsWith(".")
    ? simplifiedText.trim().slice(0, -1)
    : simplifiedText.trim();

  return (
    <div className="p-4 bg-gray-50 rounded-md mb-4">
      <span>
        {sanitizedText.split(". ").map((sentence, sentenceIndex, sentenceArray) => (
          <span
            key={sentenceIndex}
            className={sentence === selectedSentence ? "highlight-sentence" : "hover:bg-blue-100 cursor-pointer"}
            onDoubleClick={() => handleSClick(sentence)} // Double-click for sentence selection
          >
            {sentence.split(" ").map((word, wordIndex) => (
              <span
                key={`${sentenceIndex}-${wordIndex}`}
                className={word === selectedWord ? "highlight-sentence" : "hover:bg-blue-100 cursor-pointer"}
                onClick={() => handleWClick(word)} // Single-click for word selection
              >
                {word}
                {wordIndex < sentence.split(" ").length - 1 ? " " : ""}
              </span>
            ))}
            {sentenceIndex < sentenceArray.length - 1 ? ". " : "."}
          </span>
        ))}
      </span>
    </div>
  );
};

export default SimplifiedText;
