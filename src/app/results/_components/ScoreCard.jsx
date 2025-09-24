import { Paper, Title, Text, Group, RingProgress } from "@mantine/core";
import styles from "@/app/results/results.module.css";

export default function ScoreCard({ t, totalScore, callCenterScore }) {
  // Function to get score color
  const getScoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 6) return "blue";
    if (score >= 4) return "yellow";
    return "red";
  };

  return (
    <Paper p="xl" withBorder radius="md" className={styles.scoreCard}>
      <Title order={2} mb="md">
        {t.overallResults || "Overall Results"}
      </Title>

      <Group position="apart" align="flex-start">
        <div>
          <Title order={3} mb="xs">
            {t.totalScore || "Total Score"}
          </Title>
          <Text size="lg" mb="md">
            {totalScore.toFixed(1)}/10
          </Text>

          <Title order={4} mb="xs">
            {t.callCenterScore || "Call Center Score"}
          </Title>
          <Text size="lg" mb="md">
            {callCenterScore.toFixed(1)}/10
          </Text>
        </div>

        <RingProgress
          size={120}
          thickness={12}
          roundCaps
          sections={[
            { value: totalScore * 10, color: getScoreColor(totalScore) },
          ]}
          label={
            <Text size="xl" align="center" weight={700}>
              {totalScore.toFixed(1)}
            </Text>
          }
        />
      </Group>
    </Paper>
  );
}
