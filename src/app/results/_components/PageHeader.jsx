import { Box, Group } from "@mantine/core";
import { IconBrain, IconLanguage } from "@tabler/icons-react";
import styles from "@/app/results/results.module.css";

export default function PageHeader({ t, userData }) {
  return (
    <>
      <Box className={styles.title}>
        <Group justify="center" spacing="xs">
          <IconBrain size="1.5rem" stroke={1.5} />
          {t.resultsTitle || "Assessment Results"}
        </Group>
      </Box>

      <Box className={styles.subtitle}>
        <Group justify="center" spacing="xs">
          <IconLanguage size="0.9rem" />
          {userData?.name} -{" "}
          {userData?.language.charAt(0).toUpperCase() +
            userData?.language.slice(1)}
        </Group>
      </Box>
    </>
  );
}
