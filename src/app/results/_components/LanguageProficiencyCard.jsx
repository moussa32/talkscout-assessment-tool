import { Card, Title, Text, Group, RingProgress } from "@mantine/core";

export default function LanguageProficiencyCard({ 
  languageQuizScore, 
  languageQuizResults 
}) {
  // Function to get score color
  const getScoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 6) return "blue";
    if (score >= 4) return "yellow";
    return "red";
  };

  return (
    <Card withBorder p="md" radius="md" mb="md">
      <Title order={4}>Language Proficiency</Title>
      <Text size="sm" c="dimmed" mb="md">
        Score based on multiple-choice language questions
      </Text>
      <Group position="apart" align="center">
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[
            {
              value: (languageQuizScore || 0) * 10,
              color: getScoreColor(languageQuizScore || 0),
            },
          ]}
          label={
            <Text size="xs" align="center" weight={700}>
              {Math.round(languageQuizScore || 0)}/10
            </Text>
          }
        />
        <div>
          <Text>
            {languageQuizResults.correctAnswers || 0} correct out of{" "}
            {languageQuizResults.totalQuestions || 0} questions
          </Text>
        </div>
      </Group>
    </Card>
  );
}