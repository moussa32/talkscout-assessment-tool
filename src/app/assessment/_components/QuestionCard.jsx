import {
  Paper,
  Group,
  Text,
  Box,
  Progress,
  Textarea,
  Button,
} from "@mantine/core";
import {
  IconQuestionMark,
  IconClock,
  IconAlertCircle,
  IconPencil,
  IconSend,
} from "@tabler/icons-react";
import styles from "@/app/assessment/assessment.module.css";

// The component name could be updated to AssessmentQuestionCard for consistency
export default function QuestionCard({
  currentQuestion,
  activeStep,
  questionsLength,
  timeLeft,
  answer,
  setAnswer,
  isSubmitting,
  handleSubmitAnswer,
  t,
}) {
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage = (timeLeft / currentQuestion.timeLimit) * 100;

  return (
    <Paper className={styles.paper}>
      <Group className={styles.questionHeader} position="apart">
        <Group spacing="xs">
          <IconQuestionMark size="1.2rem" color="var(--mantine-color-blue-6)" />
          <Text className={styles.questionTitle}>
            {t.question} {activeStep + 1} {t.of} {questionsLength}
          </Text>
        </Group>
        <Group spacing="xs">
          <IconClock
            size="1.2rem"
            color={
              progressPercentage > 50
                ? "var(--mantine-color-blue-6)"
                : progressPercentage > 20
                ? "var(--mantine-color-yellow-6)"
                : "var(--mantine-color-red-6)"
            }
          />
          <Text>{formatTime(timeLeft)}</Text>
        </Group>
      </Group>

      <Box mb={20}>
        <Progress
          value={progressPercentage}
          color={
            progressPercentage > 50
              ? "blue"
              : progressPercentage > 20
              ? "yellow"
              : "red"
          }
          size="md"
          radius="xl"
        />
      </Box>

      <Group mb={10} spacing="xs">
        <IconAlertCircle size="1rem" />
        <Text fw={500}>{t.questionPrompt || "Question:"}</Text>
      </Group>
      <Text className={styles.questionText}>{currentQuestion.text}</Text>

      <Group mb={10} mt={20} spacing="xs">
        <IconPencil size="1rem" />
        <Text fw={500}>{t.answerPrompt || "Your Answer:"}</Text>
      </Group>
      <Textarea
        placeholder={t.answerPlaceholder}
        minRows={12}
        autosize
        maxRows={20}
        value={answer}
        onChange={(e) => setAnswer(e.currentTarget.value)}
        className={styles.textarea}
        icon={<IconPencil size="1rem" />}
      />

      <Group className={styles.buttonGroup}>
        <Button
          onClick={() => handleSubmitAnswer(false)}
          rightSection={<IconSend size="1rem" />}
          leftSection={timeLeft < 30 ? <IconAlertCircle size="1rem" /> : null}
          loading={isSubmitting}
          size="md"
          color={timeLeft < 30 ? "red" : "blue"}
        >
          {timeLeft < 30
            ? t.submitButtonUrgent || "Submit Now!"
            : t.submitButton}
        </Button>
      </Group>
    </Paper>
  );
}
