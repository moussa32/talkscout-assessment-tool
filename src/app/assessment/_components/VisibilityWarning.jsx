import { LoadingOverlay, Text, Group, Button, Title, Badge, Paper, Center } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function VisibilityWarning({ isVisible, timeLeft, onReturn, attemptsLeft }) {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 10000, 
      pointerEvents: isVisible ? 'auto' : 'none',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out'
    }}>
      <LoadingOverlay
        visible={isVisible}
        overlayBlur={5}
        overlayOpacity={0.9}
        overlayColor="red"
        zIndex={10000}
        loader={
          <Center style={{ width: '100%', height: '100%' }}>
            <Paper p="xl" radius="md" shadow="xl" style={{ maxWidth: 500, backgroundColor: '#ff4d4d' }}>
              <Group position="center" mb="lg">
                <IconAlertTriangle size={60} color="white" />
              </Group>
              
              <Title order={2} align="center" mb="md" color="white">
                WARNING! Assessment at Risk
              </Title>
              
              <Text align="center" size="xl" mb="xl" color="white" weight={600}>
                You have left the assessment page!
              </Text>
              
              <Text align="center" size="lg" mb="xl" color="white">
                Your assessment will be terminated in <strong>{timeLeft}</strong> seconds if you don't return.
              </Text>
              
              <Group position="center" mb="lg">
                <Badge color="yellow" size="xl" radius="md">
                  Attempts remaining: {attemptsLeft} of 3
                </Badge>
              </Group>
              
              <Group position="center">
                <Button 
                  color="white" 
                  onClick={onReturn} 
                  size="xl"
                  radius="md"
                  variant="filled"
                  style={{ color: 'red', fontWeight: 700 }}
                >
                  RETURN TO ASSESSMENT
                </Button>
              </Group>
            </Paper>
          </Center>
        }
      />
    </div>
  );
}