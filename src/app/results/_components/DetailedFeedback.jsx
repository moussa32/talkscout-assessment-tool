import { Title, Accordion, Group, Text, Badge, Box, Divider } from "@mantine/core";

export default function DetailedFeedback({ 
  t, 
  questions, 
  assessmentResults, 
  assessmentAnswers 
}) {
  // Function to get score color
  const getScoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 6) return "blue";
    if (score >= 4) return "yellow";
    return "red";
  };

  return (
    <>
      <Title order={2} mt="xl" mb="md">
        {t.detailedResults || "Detailed Feedback"}
      </Title>

      <Accordion>
        {questions.map((question, index) => {
          const assessment = assessmentResults[index] || {};
          const score = assessment.score || 0;

          return (
            <Accordion.Item key={index} value={`question-${index}`}>
              <Accordion.Control>
                <Group position="apart">
                  <Text weight={500}>
                    {t.question} {index + 1}
                  </Text>
                  <Badge color={getScoreColor(score)}>
                    {score.toFixed(1)}/10
                  </Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Box mb={15}>
                  <Text weight={600} size="sm" color="dimmed">
                    {t.questionLabel || "Question"}:
                  </Text>
                  <Text>{question.text}</Text>
                </Box>

                <Box mb={15}>
                  <Text weight={600} size="sm" color="dimmed">
                    {t.yourAnswer || "Your Answer"}:
                  </Text>
                  <Text>
                    {assessmentAnswers[index] ||
                      t.noAnswer ||
                      "No answer provided"}
                  </Text>
                </Box>

                <Divider my="md" />

                <Box>
                  <Text weight={600} size="sm" color="dimmed">
                    {t.feedback || "Feedback"}:
                  </Text>
                  <Text>
                    {assessment.assessment ||
                      t.noFeedback ||
                      "No feedback available"}
                  </Text>
                </Box>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
}