import { Group } from "@mantine/core";
import { GB, NL, DE } from "country-flag-icons/react/3x2";

const CountryOption = ({ value, label }) => {
  // Initialize FlagComponent as null
  let FlagComponent = null;

  // Set the appropriate flag component based on the language value
  if (value === "english") FlagComponent = GB;
  else if (value === "dutch") FlagComponent = NL;
  else if (value === "german") FlagComponent = DE;

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
