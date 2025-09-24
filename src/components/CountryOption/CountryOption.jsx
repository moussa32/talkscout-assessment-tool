import { Group } from "@mantine/core";
import { GB, NL, DE, FR, IT, ES, TR } from "country-flag-icons/react/3x2";

/**
 * Reusable component for displaying a country/language option with flag
 * Can be used in Select components across the application
 */
const CountryOption = ({ value, label }) => {
  // Initialize FlagComponent as null
  let FlagComponent = null;

  // Set the appropriate flag component based on the language value
  if (value === "english") FlagComponent = GB;
  else if (value === "dutch") FlagComponent = NL;
  else if (value === "german") FlagComponent = DE;
  else if (value === "french") FlagComponent = FR;
  else if (value === "italian") FlagComponent = IT;
  else if (value === "spanish") FlagComponent = ES;
  else if (value === "turkish") FlagComponent = TR;

  return (
    <Group spacing="xs" wrap="nowrap">
      {FlagComponent && (
        <FlagComponent style={{ width: "20px", height: "15px" }} />
      )}
      <span>{label}</span>
    </Group>
  );
};

export default CountryOption;