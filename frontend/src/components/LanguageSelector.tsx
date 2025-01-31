import React from "react";
import { useTranslation } from "react-i18next";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
    SelectGroup,
} from "./ui/select"; // Adjust the import path

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const languages = [
        { code: "en", label: "English" },
        { code: "de", label: "Deutch" },
        { code: "fr", label: "Français" },
        { code: "ar", label: "العربية" },
        { code: "hi", label: "हिन्दी" },
    ];

    return (
        <div className="flex justify-end">
            <Select onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px] border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200 shadow-sm">
                    <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                                {lang.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default LanguageSelector;
