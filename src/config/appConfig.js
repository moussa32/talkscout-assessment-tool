/**
 * Application Configuration
 * This file contains all configurable constants for the application
 */

const appConfig = {
  // Assessment timing settings
  timing: {
    // Time in seconds for each MCQ question in language quiz
    languageQuizQuestionTime: 30,
    
    // Default time for call center assessment questions (if not specified in question)
    defaultQuestionTime: 120,
    
    // Warning time threshold in seconds (when timer turns yellow)
    warningTimeThreshold: 30,
    
    // Critical time threshold in seconds (when timer turns red)
    criticalTimeThreshold: 15,
  },
  
  // Scoring weights
  scoring: {
    // Weight of language quiz in final score (0-1)
    languageQuizWeight: 0.7,
    
    // Weight of call center assessment in final score (0-1)
    callCenterWeight: 0.3,
  },
  
  // UI display options
  display: {
    // Show detailed results breakdown only in development mode
    showDetailedResults: process.env.NODE_ENV === 'development',
    
    // Show individual question feedback
    showQuestionFeedback: true,
    
    // Show score distribution chart
    showScoreChart: true,
  },
  
  // Assessment settings
  assessment: {
    // Maximum number of visibility violations before automatic failure
    maxVisibilityViolations: 3,
    
    // Grace period in seconds after visibility violation
    visibilityGracePeriod: 10,
  }
};

export default appConfig;