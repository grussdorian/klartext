
import React, { useRef, useEffect } from "react";

const SimplifiedText = ({
  simplifiedText,
  selectedSentence,
  selectedWord,
  handleWordClick,
  handleSentenceClick,
  clickable,
}) => {
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleWordSingleClick = (word: string) => {
    if (clickable) {
      handleWordClick(word);
    }
  };

  const handleWordDoubleClick = (word: string) => {
    if (clickable) {
      const sentence = getSentenceContainingWord(word);
      handleSentenceClick(sentence);
    }
  };

  const handleWordClickEvent = (word: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      handleWordDoubleClick(word);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        handleWordSingleClick(word);
        clickTimeoutRef.current = null;
      }, 250);
    }
  };

  const handleSentenceDoubleClickEvent = (sentence: string) => {
    if (clickable) {
      handleSentenceClick(sentence);
    }
  };

  const getSentenceContainingWord = (word: string): string => {
    const sentences = sanitizedText.split(". ");
    for (let sentence of sentences) {
      if (sentence.split(" ").includes(word)) {
        return sentence;
      }
    }
    return "";
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

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
            className={
              sentence === selectedSentence
                ? "highlight-sentence"
                : "hover:bg-blue-100 cursor-pointer"
            }
            onDoubleClick={() => handleSentenceDoubleClickEvent(sentence)}
          >
            {sentence.split(" ").map((word, wordIndex) => (
              <span
                key={`${sentenceIndex}-${wordIndex}`}
                className={
                  word === selectedWord
                    ? "highlight-sentence"
                    : "hover:bg-red-100 cursor-pointer"
                }
                onClick={(event) => handleWordClickEvent(word, event)}
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