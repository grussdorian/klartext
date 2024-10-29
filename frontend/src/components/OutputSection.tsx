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

  return (

  <div className="p-4 bg-gray-50 rounded-md mb-4">
    {simplifiedText.split(". ").map((sentence, sentenceIndex) => (
      <p
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
            {word}{" "}
          </span>
        ))}
      </p>
    ))}
  </div>
  );
};

export default SimplifiedText;
