import { Badge } from "@mantine/core";

export default function StatusBadges({ t, assessmentCompleted, savingError }) {
  return (
    <>
      {assessmentCompleted && (
        <Badge
          size="lg"
          color="green"
          variant="filled"
          mx="auto"
          mb="md"
          style={{ display: "table" }}
        >
          {t.assessmentCompleted || "Assessment Completed"}
        </Badge>
      )}

      {savingError && (
        <Badge
          color="red"
          size="lg"
          mx="auto"
          mb="md"
          style={{ display: "table" }}
        >
          Error saving results: {savingError}
        </Badge>
      )}
    </>
  );
}
