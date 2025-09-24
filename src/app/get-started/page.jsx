"use client";

import {
  TextInput,
  Button,
  Paper,
  Title,
  Container,
  List,
  Alert,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import {
  IconAlertCircle,
  IconUser,
  IconPhone,
  IconArrowRight,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { translations } from "@/utils/translations";
import { useAssessmentStore } from "@/store/assessmentStore";
import { LanguageSelect } from "@/components/LanguageSelect";

export default function LoginPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [t, setT] = useState(translations.english);

  // Get state from Zustand store
  const { initializeUserData, assessmentCompleted, userData } =
    useAssessmentStore();

  // Check if assessment is already completed
  useEffect(() => {
    if (assessmentCompleted && userData) {
      router.push("/results");
    }
  }, [assessmentCompleted, userData, router]);

  const { setFieldValue, getInputProps, values, onSubmit } = useForm({
    initialValues: {
      name: "",
      phoneNumber: "",
      language: "",
    },
    validate: {
      name: (value) => (value.length < 2 ? t.validation.nameRequired : null),
      /*phoneNumber: (value) =>
        /^\d{10,}$/.test(value) ? null : t.validation.phoneRequired,*/
      language: (value) => (!value ? t.validation.languageRequired : null),
    },
  });

  // Update translations when language changes
  useEffect(() => {
    if (selectedLanguage) {
      setT(translations[selectedLanguage]);
    } else {
      // Reset to English if language is cleared
      setT(translations.english);
    }
  }, [selectedLanguage]);

  // Update translations when language changes
  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    setFieldValue("language", value);
  };

  const handleSubmit = (values) => {
    initializeUserData(values);

    // Navigate to assessment page
    router.push("/assessment");
  };

  return (
    <Container size={520} my={40}>
      <Title align="center" mb={5}>
        {t.title}
      </Title>
      <Text align="center" mb={20} size="sm" c="dimmed">
        {t.subtitle}
      </Text>

      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title={t.rules.title}
        color="blue"
        mb={20}
      >
        <List size="sm" spacing="xs">
          <List.Item>{t.rules.rule1}</List.Item>
          <List.Item>{t.rules.rule2}</List.Item>
          <List.Item>{t.rules.rule3}</List.Item>
          <List.Item>{t.rules.rule4}</List.Item>
        </List>
      </Alert>

      <Paper
        component="form"
        withBorder
        shadow="md"
        onSubmit={onSubmit(handleSubmit)}
        p={30}
        mt={30}
        radius="md"
      >
        <TextInput
          label={t.form.name}
          placeholder={t.form.namePlaceholder}
          required
          leftSection={<IconUser size="1rem" />}
          {...getInputProps("name")}
        />

        <TextInput
          label={t.form.phone}
          placeholder={t.form.phonePlaceholder}
          required
          mt="md"
          leftSection={<IconPhone size="1rem" />}
          {...getInputProps("phoneNumber")}
        />

        <LanguageSelect
          label={t.form.language}
          placeholder={t.form.languagePlaceholder}
          required
          mt="md"
          value={values.language}
          onChange={handleLanguageChange}
          error={getInputProps("language").error}
          languages={["english", "german", "dutch"]}
        />

        <Button
          fullWidth
          mt="xl"
          type="submit"
          rightSection={<IconArrowRight size="1rem" />}
          disabled={!values.language}
        >
          {t.form.startButton}
        </Button>
      </Paper>
    </Container>
  );
}
