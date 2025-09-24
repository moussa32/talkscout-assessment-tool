import { GB, NL, DE } from "country-flag-icons/react/3x2";
import { IconLanguage } from "@tabler/icons-react";

// Function to get flag component based on language
export const getFlagComponent = (language) => {
  if (language === "english")
    return <GB style={{ width: "16px", height: "12px" }} />;
  if (language === "dutch")
    return <NL style={{ width: "16px", height: "12px" }} />;
  if (language === "german")
    return <DE style={{ width: "16px", height: "12px" }} />;
  return <IconLanguage size="1rem" />;
};
