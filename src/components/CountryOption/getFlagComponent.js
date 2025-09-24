import { GB, NL, DE, FR, IT, ES, TR } from "country-flag-icons/react/3x2";

/**
 * Returns the appropriate flag component based on language code
 * @param {string} language - The language code (e.g., "english", "dutch")
 * @returns {React.Component|null} The flag component or null if not found
 */
export const getFlagComponent = (language) => {
  if (language === "english") return <GB style={{ width: "20px", height: "15px" }} />;
  if (language === "dutch") return <NL style={{ width: "20px", height: "15px" }} />;
  if (language === "german") return <DE style={{ width: "20px", height: "15px" }} />;
  if (language === "french") return <FR style={{ width: "20px", height: "15px" }} />;
  if (language === "italian") return <IT style={{ width: "20px", height: "15px" }} />;
  if (language === "spanish") return <ES style={{ width: "20px", height: "15px" }} />;
  if (language === "turkish") return <TR style={{ width: "20px", height: "15px" }} />;
  
  return null;
};

/**
 * Get a list of all available languages with their flags
 * @returns {Array} Array of language objects with value, label, and flag component
 */
export const getLanguagesList = () => [
  { value: "english", label: "English", flag: GB },
  { value: "dutch", label: "Dutch", flag: NL },
  { value: "german", label: "German", flag: DE },
  { value: "french", label: "French", flag: FR },
  { value: "italian", label: "Italian", flag: IT },
  { value: "spanish", label: "Spanish", flag: ES },
  { value: "turkish", label: "Turkish", flag: TR },
];