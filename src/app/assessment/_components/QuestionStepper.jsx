import { Stepper, Badge } from "@mantine/core";
import {
  IconCheck,
  IconX,
  IconQuestionMark,
  IconHourglass,
} from "@tabler/icons-react";
import styles from "@/app/assessment/assessment.module.css";

// The component name could be updated to AssessmentQuestionStepper for consistency
export default function QuestionStepper({
  questions,
  activeStep,
  questionStatus,
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

  return (
    <Stepper
      active={activeStep}
      breakpoint="sm"
      className={styles.stepper}
      allowNextStepsSelect={false}
      classNames={{
        stepBody: styles.stepBody,
        step: styles.step,
        stepLabel: styles.stepLabel,
        stepCompletedIcon: styles.stepCompletedIcon,
      }}
    >
      {questions.map((question, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;
        const status = questionStatus[index];

        // Determine color based on completion status
        let stepColor = isActive ? "blue" : "gray";
        if (isCompleted) {
          stepColor =
            status === "success"
              ? "green"
              : status === "failure"
              ? "red"
              : "blue";
        }

        return (
          <Stepper.Step
            key={index}
            label={`${t.question} ${index + 1}`}
            description={
              <Badge
                color={stepColor}
                variant={isActive ? "filled" : "light"}
                size="sm"
                leftSection={isActive ? <IconHourglass size="0.7rem" /> : null}
              >
                {formatTime(question.timeLimit)}
              </Badge>
            }
            completedIcon={
              status === "failure" ? (
                <IconX size="1rem" />
              ) : (
                <IconCheck size="1rem" />
              )
            }
            color={stepColor}
            icon={isActive ? <IconQuestionMark size="1rem" /> : undefined}
          />
        );
      })}
    </Stepper>
  );
}
