"use client";

import { useState, useEffect, useRef } from "react";
import { Container, Title, Text, Group } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconBrain, IconLanguage } from "@tabler/icons-react";
import { useDocumentVisibility } from "@mantine/hooks";
import styles from "./assessment.module.css";
import { useAssessmentStore } from "@/store/assessmentStore";

import QuestionStepper from "@/app/assessment/_components/QuestionStepper";
import QuestionCard from "@/app/assessment/_components/QuestionCard";
import LoadingState from "@/app/assessment/_components/LoadingState";
import LanguageQuiz from "@/app/assessment/_components/LanguageQuiz";
import { languageQuestions } from "@/utils/languageQuestions";
import VisibilityWarning from "@/app/assessment/_components/VisibilityWarning";
import appConfig from "@/config/appConfig";

export default function AssessmentPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const visibilityTimeoutRef = useRef(null);
  const [visibilityWarningActive, setVisibilityWarningActive] = useState(false);
  const [warningTimeLeft, setWarningTimeLeft] = useState(10);
  const warningIntervalRef = useRef(null);

  // Use Mantine's hook to track document visibility
  const documentVisibility = useDocumentVisibility();

  const {
    userData,
    activeStep,
    answer,
    language,
    questions,
    t,
    questionStatus,
    assessmentCompleted,
    assessmentFailed,
    setActiveStep,
    setAnswer,
    updateQuestionStatus,
    updateAssessmentResult,
    updateAssessmentAnswer,
    initializeUserData,
    setAssessmentFailed,
    setAssessmentCompleted,
    languageQuizCompleted,
    setLanguageQuizCompleted,
    setLanguageQuizScore,
    setLanguageQuizResults,
    visibilityViolations,
    incrementVisibilityViolations,
  } = useAssessmentStore();

  // Check if assessment is already completed or failed
  useEffect(() => {
    if (assessmentCompleted && userData) {
      router.push("/results");
    } else if (assessmentFailed) {
      router.push("/failed");
    }
  }, [assessmentCompleted, assessmentFailed, userData, router]);

  // Handle returning to the assessment
  const handleReturnToAssessment = () => {
    if (visibilityTimeoutRef.current) {
      clearTimeout(visibilityTimeoutRef.current);
      visibilityTimeoutRef.current = null;
    }

    if (warningIntervalRef.current) {
      clearInterval(warningIntervalRef.current);
      warningIntervalRef.current = null;
    }

    setVisibilityWarningActive(false);
  };

  // Use the documentVisibility hook to track when user leaves the page
  useEffect(() => {
    if (documentVisibility === "hidden") {
      // User left the page - increment violation count
      incrementVisibilityViolations();

      // Get current violation count from store to check limit
      const currentCount = useAssessmentStore.getState().visibilityViolations;

      // If this would exceed the max violations, fail immediately
      if (currentCount >= appConfig.assessment.maxVisibilityViolations - 1) {
        setAssessmentFailed(true);
        return;
      }

      // Start the grace period
      setVisibilityWarningActive(true);
      setWarningTimeLeft(appConfig.assessment.visibilityGracePeriod);

      // Clear any existing timeout
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }

      // Clear any existing interval
      if (warningIntervalRef.current) {
        clearInterval(warningIntervalRef.current);
      }

      // Start countdown interval
      warningIntervalRef.current = setInterval(() => {
        setWarningTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(warningIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Set a new timeout for 10 seconds
      visibilityTimeoutRef.current = setTimeout(() => {
        setAssessmentFailed(true);
      }, 10000); // 10 seconds
    } else if (documentVisibility === "visible" && visibilityWarningActive) {
      // User returned to the page
      handleReturnToAssessment();
    }
  }, [documentVisibility]); // Removed visibilityViolations from dependencies to prevent infinite loop

  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
      if (warningIntervalRef.current) {
        clearInterval(warningIntervalRef.current);
      }
    };
  }, []);

  // Load user data from store or localStorage
  useEffect(() => {
    if (!userData) {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        initializeUserData(parsedData);
      } else {
        // Redirect to get-started if no user data
        router.push("/get-started");
      }
    }
  }, [router, userData, initializeUserData]);

  // Set up timer for current question
  useEffect(() => {
    if (activeStep < questions.length) {
      setTimeLeft(questions[activeStep]?.timeLimit || 120);
      // Clear the answer when moving to a new question
      setAnswer("");

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            // When time runs out, save answer and move to next question
            handleSubmitAnswer(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeStep, questions]);

  // Simplified submission function that handles both manual submission and timeouts
  const handleSubmitAnswer = async (isTimeout = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Store the current answer
    updateAssessmentAnswer(activeStep, answer);

    // Get assessment from Gemini API
    const assessmentData = await sendAssessmentToGemini(
      questions[activeStep].text,
      answer,
      language
    );

    // Store assessment result
    updateAssessmentResult(activeStep, assessmentData);

    // Update question status
    updateQuestionStatus(activeStep, "success");

    // Move to next question or finish
    if (activeStep < questions.length - 1) {
      setActiveStep(activeStep + 1);
      setAnswer("");
    } else {
      // All questions answered, mark assessment as completed
      setAssessmentCompleted(true);
      // Proceed to results
      router.push("/results");
    }

    setIsSubmitting(false);
  };

  // Function to send assessment to Gemini API - simplified
  const sendAssessmentToGemini = async (question, answer, language) => {
    try {
      // Make API call to your backend which will call Gemini
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          question,
          answer,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get assessment");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error assessing answer:", error);
      return null;
    }
  };

  // Handle language quiz completion
  const handleLanguageQuizComplete = (results) => {
    setLanguageQuizCompleted(true);
    setLanguageQuizScore(results.score);
    setLanguageQuizResults(results);
  };

  // Determine if we're in the MCQ phase or the writing phase
  const isLanguageQuizPhase = !languageQuizCompleted;

  if (!userData || !questions.length) {
    return <LoadingState />;
  }

  // Show language quiz first if not completed
  if (isLanguageQuizPhase) {
    return (
      <Container size={700} className={styles.container}>
        <Title className={styles.title}>
          <Group justify="center" spacing="xs">
            <IconLanguage size="1.5rem" stroke={1.5} />
            Language Proficiency Test
          </Group>
        </Title>
        <Text className={styles.subtitle} ta="center">
          Part 1 of 2: Multiple Choice Questions
        </Text>
        <Text ta="center" mb="xl" size="sm" color="dimmed">
          Please complete this short language quiz before proceeding to the
          writing assessment.
        </Text>

        <LanguageQuiz
          questions={languageQuestions[language] || []}
          language={language}
          onComplete={handleLanguageQuizComplete}
        />
      </Container>
    );
  }

  // Return JSX
  return (
    <>
      <Container size={700} className={styles.container}>
        <Title className={styles.title}>
          <Group justify="center" spacing="xs">
            <IconBrain size="1.5rem" stroke={1.5} />
            {t.assessmentTitle || t.testTitle}
          </Group>
        </Title>
        <Text className={styles.subtitle}>
          <Group justify="center" spacing="xs">
            <IconLanguage size="0.9rem" />
            Part 2 of 2: Writing Assessment
          </Group>
        </Text>
        <Text ta="center" mb="md" size="sm" color="dimmed">
          Respond to each scenario in{" "}
          {userData.language.charAt(0).toUpperCase() +
            userData.language.slice(1)}
          as if you were speaking to a customer.
        </Text>

        <QuestionStepper
          questions={questions}
          activeStep={activeStep}
          questionStatus={questionStatus}
          t={t}
        />

        <QuestionCard
          currentQuestion={questions[activeStep]}
          activeStep={activeStep}
          questionsLength={questions.length}
          timeLeft={timeLeft}
          answer={answer}
          setAnswer={setAnswer}
          isSubmitting={isSubmitting}
          handleSubmitAnswer={handleSubmitAnswer}
          t={t}
        />
      </Container>

      {/* Add the warning overlay outside the container */}
      <VisibilityWarning
        isVisible={visibilityWarningActive}
        timeLeft={warningTimeLeft}
        onReturn={handleReturnToAssessment}
        attemptsLeft={3 - visibilityViolations}
      />
    </>
  );
}
