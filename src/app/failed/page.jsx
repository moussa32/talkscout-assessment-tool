"use client";

import { Container, Title, Text, Button, Paper, Group } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessmentStore";
import styles from "./failed.module.css";
import { useEffect } from "react";

export default function FailedPage() {
  const router = useRouter();
  const {
    resetAssessment,
    setUserData,
    setAssessmentAnswers,
    setAssessmentResults,
    setLanguageQuizResults,
    setLanguageQuizScore,
    resetVisibilityViolations,
  } = useAssessmentStore();

  // Clear all user data when this page loads
  useEffect(() => {
    // Reset all store data
    setUserData(null);
    setAssessmentAnswers([]);
    setAssessmentResults([]);
    setLanguageQuizResults(null);
    setLanguageQuizScore(0);
    resetVisibilityViolations();
    resetAssessment();
  }, []);

  const handleRetry = () => {
    router.push("/get-started");
  };

  return (
    <Container size={700} className={styles.container}>
      <Paper withBorder p="xl" radius="md" shadow="md" className={styles.paper}>
        <Group justify="center" mb="lg">
          <IconAlertTriangle size={50} color="red" />
        </Group>

        <Title align="center" order={2} mb="md" className={styles.title}>
          Assessment Failed
        </Title>

        <Text ta="center" size="lg" mb="xl">
          Your assessment has been terminated because you left the application
          too many times (more than 3 attempts) or for more than 10 seconds.
        </Text>

        <Text ta="center" c="dimmed" mb="xl" className={styles.subtitle}>
          As mentioned in the rules, you cannot leave or close the tab during
          the assessment.
        </Text>

        <Group justify="center">
          <Button
            leftSection={<IconArrowLeft size="1rem" />}
            onClick={handleRetry}
            size="md"
            color="red"
          >
            Return to Start
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
