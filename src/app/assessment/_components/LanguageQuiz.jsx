import { useState, useEffect, useRef } from "react";
import {
  Paper,
  Title,
  Text,
  Radio,
  Group,
  Button,
  Stack,
  Progress,
  Badge,
} from "@mantine/core";
import { IconCheck, IconX, IconClock } from "@tabler/icons-react";
import styles from "@/app/assessment/assessment.module.css";
import appConfig from "@/config/appConfig";

export default function LanguageQuiz({ questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);

  // Use time from config
  const questionTime = appConfig.timing.languageQuizQuestionTime;
  const [timeLeft, setTimeLeft] = useState(questionTime);
  const timerRef = useRef(null);

  // Start timer when component mounts or question changes
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Reset time for new question
    setTimeLeft(questionTime);

    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Time's up - move to next question or show results
          clearInterval(timerRef.current);

          // Auto-select current answer as null if not selected
          if (selectedAnswers[currentQuestion] === null) {
            const newAnswers = [...selectedAnswers];
            newAnswers[currentQuestion] = null;
            setSelectedAnswers(newAnswers);
          }

          // Move to next question or finish
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
          } else {
            setShowResults(true);

            // Calculate score
            const correctAnswers = selectedAnswers.reduce(
              (count, answer, index) => {
                return (
                  count + (answer === questions[index].correctAnswer ? 1 : 0)
                );
              },
              0
            );

            const score = (correctAnswers / questions.length) * 10;

            // Pass results to parent component
            onComplete({
              score,
              correctAnswers,
              totalQuestions: questions.length,
            });
          }

          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clean up timer when component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, questions.length, questionTime]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    // Clear current timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // We don't need to reset the selected answer here as we're storing all answers in an array
    } else {
      setShowResults(true);

      // Calculate score
      const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
        return count + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);

      const score = (correctAnswers / questions.length) * 10;

      // Pass results to parent component
      onComplete({
        score,
        correctAnswers,
        totalQuestions: questions.length,
      });
    }
  };

  const isAnswerSelected = selectedAnswers[currentQuestion] !== null;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Calculate time progress percentage
  const timeProgress = (timeLeft / questionTime) * 100;

  if (showResults) {
    // Results display code remains the same
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    return (
      <Paper p="md" withBorder className={styles.paper}>
        <Title order={3} align="center" mb="md">
          Language Quiz Complete
        </Title>
        <Text align="center" size="lg" mb="xl">
          You answered {correctAnswers} out of {questions.length} questions
          correctly.
        </Text>

        <Stack spacing="xs">
          {questions.map((question, index) => (
            <Group key={question.id} position="apart">
              <Text size="sm" lineClamp={1}>
                Question {index + 1}
              </Text>
              <Badge
                color={
                  selectedAnswers[index] === question.correctAnswer
                    ? "green"
                    : "red"
                }
                leftSection={
                  selectedAnswers[index] === question.correctAnswer ? (
                    <IconCheck size="0.8rem" />
                  ) : (
                    <IconX size="0.8rem" />
                  )
                }
              >
                {selectedAnswers[index] === question.correctAnswer
                  ? "Correct"
                  : "Incorrect"}
              </Badge>
            </Group>
          ))}
        </Stack>
      </Paper>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Paper p="md" withBorder className={styles.paper}>
      <Group position="apart" mb="xs">
        <Text weight={500}>Language Proficiency Quiz</Text>
        <Group spacing="xs">
          <Badge>
            {currentQuestion + 1} of {questions.length}
          </Badge>
          <Group spacing={5}>
            <IconClock
              size="1rem"
              color={
                timeProgress > 50
                  ? "var(--mantine-color-blue-6)"
                  : timeProgress > 20
                  ? "var(--mantine-color-yellow-6)"
                  : "var(--mantine-color-red-6)"
              }
            />
            <Text>{formatTime(timeLeft)}</Text>
          </Group>
        </Group>
      </Group>

      <Progress value={progress} mb="xs" size="sm" color="blue" />

      <Progress
        value={timeProgress}
        mb="md"
        size="xs"
        color={
          timeProgress > 50 ? "blue" : timeProgress > 20 ? "yellow" : "red"
        }
      />

      <Title order={4} mb="md">
        {question.text}
      </Title>

      <Radio.Group
        value={
          selectedAnswers[currentQuestion] !== null
            ? selectedAnswers[currentQuestion].toString()
            : ""
        }
        onChange={(value) => handleAnswerSelect(parseInt(value))}
      >
        <Stack>
          {question.options.map((option, index) => (
            <Radio key={index} value={index.toString()} label={option} />
          ))}
        </Stack>
      </Radio.Group>

      <Group position="right" mt="xl">
        <Button
          onClick={handleNext}
          disabled={!isAnswerSelected}
          color={timeLeft < 10 ? "red" : "blue"}
          leftSection={timeLeft < 10 ? <IconClock size="1rem" /> : null}
        >
          {currentQuestion < questions.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </Group>
    </Paper>
  );
}
