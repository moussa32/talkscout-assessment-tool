import React, { useState, useEffect, useMemo } from "react";
import { Select } from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";
import {
  CountryOption,
  getFlagComponent,
  getLanguagesList,
} from "@/components/CountryOption";

/**
 * A reusable language selection component
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Selected language value
 * @param {Function} props.onChange - Function called when language changes
 * @param {string} props.label - Label for the select field
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether the field is required
 * @param {Object} props.error - Error message
 * @param {string} props.name - Field name for form integration
 * @param {Array} props.languages - Optional array of language codes to include (e.g. ["english", "german"])
 * @param {Object} props.formProps - Additional props from form library
 */
const LanguageSelect = ({
  value,
  onChange,
  label = "Language",
  placeholder = "Select a language",
  required = false,
  error,
  name,
  languages,
  formProps = {},
  ...props
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(value || null);

  // Filter language options if languages prop is provided
  const languageOptions = useMemo(() => {
    const allLanguages = getLanguagesList();

    // If languages array is provided, filter the options
    if (languages && Array.isArray(languages) && languages.length > 0) {
      return allLanguages
        .filter((lang) => languages.includes(lang.value))
        .map(({ value, label }) => ({ value, label }));
    }

    // Otherwise return all languages
    return allLanguages.map(({ value, label }) => ({ value, label }));
  }, [languages]);

  // Update internal state when external value changes
  useEffect(() => {
    setSelectedLanguage(value);
  }, [value]);

  // Handle language change
  const handleLanguageChange = (newValue) => {
    setSelectedLanguage(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Select
      label={label}
      placeholder={placeholder}
      data={languageOptions}
      value={selectedLanguage}
      onChange={handleLanguageChange}
      required={required}
      error={error}
      name={name}
      leftSection={
        selectedLanguage ? (
          getFlagComponent(selectedLanguage)
        ) : (
          <IconLanguage size="1rem" />
        )
      }
      renderOption={({ option }) => (
        <CountryOption value={option.value} label={option.label} />
      )}
      clearable
      searchable
      {...formProps}
      {...props}
    />
  );
};

export default LanguageSelect;
