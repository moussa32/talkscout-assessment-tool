"use client";

import { useState, useEffect } from "react";
import { Container, Text, Switch, Box, Title, Paper } from "@mantine/core";
import { useRouter } from "next/navigation";
import styles from "./results.module.css";
import { useAssessmentStore } from "@/store/assessmentStore";

// Import new components
import PageHeader from "@/app/results/_components/PageHeader";
import StatusBadges from "@/app/results/_components/StatusBadges";
import ScoreCard from "@/app/results/_components/ScoreCard";
import LanguageProficiencyCard from "@/app/results/_components/LanguageProficiencyCard";
import DetailedFeedback from "@/app/results/_components/DetailedFeedback";
import appConfig from "@/config/appConfig";

export default function ResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [callCenterScore, setCallCenterScore] = useState(0);
  const [resultsSaved, setResultsSaved] = useState(false);
  const [savingError, setSavingError] = useState(null);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  // Get state from Zustand store
  const {
    userData,
    language,
    questions,
    t,
    assessmentAnswers,
    assessmentResults,
    assessmentCompleted,
    languageQuizScore,
    languageQuizResults,
  } = useAssessmentStore();

  // Add a function to save results to Supabase
  const saveResultsToSupabase = async () => {
    try {
      // Calculate call center score (assessment score)
      const assessmentScore = calculateCallCenterScore();

      // Set the call center score state
      setCallCenterScore(assessmentScore);

      // Calculate total weighted score
      const calculatedTotalScore = calculateOverallScore();
      setTotalScore(calculatedTotalScore);

      console.log("Saving results to Supabase:", {
        userData: {
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          language: language,
        },
        languageQuizScore: languageQuizScore || 0,
        callCenterScore: assessmentScore,
        totalScore: calculatedTotalScore,
      });

      const response = await fetch("/api/save-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userData: {
            name: userData.name,
            phoneNumber: userData.phoneNumber,
            language: language,
          },
          languageQuizScore: languageQuizScore || 0,
          callCenterScore: assessmentScore,
          totalScore: calculatedTotalScore,
        }),
      });

      const data = await response.json();
      console.log("Response from save-results API:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to save results");
      }

      setResultsSaved(true);
    } catch (error) {
      console.error("Error saving results:", error);
      setSavingError(error.message);
    }
  };

  // Main useEffect for loading data and calculating scores
  useEffect(() => {
    // Only redirect if we have no data at all
    if (!userData) {
      router.push("/get-started");
      return;
    }

    // Don't redirect if we have userData, even if assessment isn't completed
    // This allows viewing partial results

    if (assessmentResults && assessmentResults.length > 0) {
      // Calculate call center score
      const assessmentScore = calculateCallCenterScore();
      setCallCenterScore(assessmentScore);

      // Calculate total score from assessment results and language quiz
      const calculatedScore = calculateOverallScore();
      setTotalScore(calculatedScore);
    } else if (assessmentAnswers && assessmentAnswers.length > 0) {
      // If no assessment results but we have answers, process them
      processAnswers();
    }

    setLoading(false);
  }, [
    router,
    userData,
    assessmentResults,
    assessmentAnswers,
    questions,
    assessmentCompleted,
    languageQuizScore,
  ]);

  // Calculate call center score (assessment score)
  const calculateCallCenterScore = () => {
    if (!assessmentResults || assessmentResults.length === 0) {
      return 0;
    }

    // Filter out any null or undefined results, or results without a valid score
    const validResults = assessmentResults.filter(
      (result) =>
        result && typeof result.score === "number" && !isNaN(result.score)
    );

    if (validResults.length === 0) {
      return 0;
    }

    // Sum up all valid scores
    const totalScore = validResults.reduce(
      (sum, result) => sum + result.score,
      0
    );
    // Calculate average
    const averageScore = totalScore / validResults.length;

    // Round to 1 decimal place
    return Math.round(averageScore * 10) / 10;
  };

  // Calculate overall score including language quiz
  const calculateOverallScore = () => {
    // Get the call center assessment score
    const assessmentAverage = calculateCallCenterScore();

    // Get the language quiz score (already on a scale of 0-10)
    const languageScore =
      typeof languageQuizScore === "number" && !isNaN(languageQuizScore)
        ? languageQuizScore
        : 0;

    // Use weights from config
    const weightedScore =
      assessmentAverage * appConfig.scoring.callCenterWeight +
      languageScore * appConfig.scoring.languageQuizWeight;

    // Round to 1 decimal place for display
    return Math.round(weightedScore * 10) / 10;
  };

  // Add a state to track if we've attempted to save
  const [saveAttempted, setSaveAttempted] = useState(false);

  // Save results when they're available - separate useEffect
  useEffect(() => {
    // Only save if:
    // 1. Assessment is completed
    // 2. We have results
    // 3. Results haven't been saved yet
    // 4. We haven't attempted to save yet (this prevents multiple save attempts)
    if (
      assessmentCompleted &&
      assessmentResults?.length > 0 &&
      !resultsSaved &&
      !saveAttempted
    ) {
      setSaveAttempted(true); // Mark that we've attempted to save
      saveResultsToSupabase();
    }
  }, [assessmentCompleted, assessmentResults, resultsSaved, saveAttempted]);

  // Process answers if assessments aren't already stored
  const processAnswers = async () => {
    if (!assessmentAnswers.length || !questions.length) return;

    const newAssessments = [];
    let totalScore = 0;

    for (let i = 0; i < assessmentAnswers.length; i++) {
      if (!assessmentAnswers[i]) continue;

      try {
        const response = await fetch("/api/assess", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language,
            question: questions[i].text,
            answer: assessmentAnswers[i],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get assessment");
        }

        const data = await response.json();
        newAssessments[i] = data;

        if (data.score) {
          totalScore += data.score;
        }
      } catch (error) {
        console.error(`Error assessing answer ${i}:`, error);
        newAssessments[i] = {
          assessment: "Error processing assessment",
          score: 0,
        };
      }
    }

    // Calculate average score
    const avgScore =
      assessmentAnswers.length > 0 ? totalScore / assessmentAnswers.length : 0;
    setTotalScore(avgScore);

    // Update the store with assessment results
    const { setAssessmentResults } = useAssessmentStore.getState();
    setAssessmentResults(newAssessments);
  };

  // Function to render stars based on score
  const renderStars = (score) => {
    const fullStars = Math.floor(score / 2);
    const hasHalfStar = score % 2 >= 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <Group spacing={4}>
        {[...Array(fullStars)].map((_, i) => (
          <IconStarFilled key={`full-${i}`} size="1.2rem" color="gold" />
        ))}
        {hasHalfStar && <IconStar key="half" size="1.2rem" color="gold" />}
        {[...Array(emptyStars)].map((_, i) => (
          <IconStar key={`empty-${i}`} size="1.2rem" color="gray" />
        ))}
      </Group>
    );
  };

  // Simple thank you message component
  const ThankYouMessage = () => (
    <Paper p="xl" withBorder radius="md" className={styles.scoreCard}>
      <Box py={40} px={20} style={{ textAlign: "center" }}>
        <Title order={1} mb={20}>
          Thank You!
        </Title>
        <Text size="xl" mb={30}>
          Your assessment has been completed successfully.
        </Text>
        <Text c="dimmed">
          Your results have been saved and will be reviewed by our team.
        </Text>
      </Box>
    </Paper>
  );

  if (loading) {
    return (
      <Container size={700} className={styles.container}>
        <Text>Loading results...</Text>
      </Container>
    );
  }

  return (
    <Container size={700} className={styles.container}>
      <PageHeader t={t} userData={userData} />

      <StatusBadges
        t={t}
        assessmentCompleted={assessmentCompleted}
        savingError={savingError}
      />

      {/* Admin toggle - only visible in development mode */}
      {appConfig.display.showDetailedResults && (
        <Box mb={20} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Switch
            label="Show detailed results"
            checked={showDetailedResults}
            onChange={(event) =>
              setShowDetailedResults(event.currentTarget.checked)
            }
          />
        </Box>
      )}

      {!showDetailedResults ? (
        <ThankYouMessage />
      ) : (
        <>
          {/* Update ScoreCard to pass callCenterScore */}
          <ScoreCard
            t={t}
            totalScore={totalScore}
            callCenterScore={callCenterScore}
          />

          {languageQuizResults && (
            <LanguageProficiencyCard
              languageQuizScore={languageQuizScore}
              languageQuizResults={languageQuizResults}
            />
          )}

          <DetailedFeedback
            t={t}
            questions={questions}
            assessmentResults={assessmentResults}
            assessmentAnswers={assessmentAnswers}
          />
        </>
      )}
    </Container>
  );
}
