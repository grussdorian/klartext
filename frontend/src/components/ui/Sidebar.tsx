// components/Sidebar.tsx
import React from "react";
import { X } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  sidebarEntries: Array<{ word: string; definition: string; synonyms: string[] }>;
  removeSidebarEntry: (word: string) => void;
  handleWordClick: (word: string) => void;
  handleSynonymClick: (word: string, event: React.MouseEvent<HTMLSpanElement>) => void;
  setSelectedWord: (word: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  sidebarEntries,
  removeSidebarEntry,
  handleWordClick,
  handleSynonymClick,
  setSelectedWord,
}) => {
   const { t } = useTranslation();
  return (
    <div
      className={`fixed top-0 right-0 w-72 h-full bg-gray-50 p-4 border-l shadow-lg overflow-auto transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <button onClick={toggleSidebar} className="text-primary-foreground hover:text-red-700 mb-4">
        {t("Close Sidebar")}
      </button>
      <h3 className="font-bold mb-4">{t("Definitions & Synonyms")}</h3>
      {sidebarEntries.map((entry) => (
        <div key={entry.word} className="mb-4 bg-white p-3 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <strong>{entry.word}</strong>
            <button
              onClick={() => removeSidebarEntry(entry.word)}
              className="text-primary-foreground hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm mb-2">
            <strong>{t("Definition")}:</strong> {entry.definition}
          </p>
          <p className="text-sm">
            <strong>{t("Synonyms")}:</strong>{" "}
            {entry.synonyms.map((synonym, index) => (
              <span
                key={index}
                className="hover:bg-blue-100 cursor-pointer px-1 rounded"
                onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
                  setSelectedWord(entry.word);
                  handleSynonymClick(synonym, event);
                }}
              >
                {synonym}{" "}
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
