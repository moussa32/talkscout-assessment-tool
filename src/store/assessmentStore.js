import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { translations, questions as questionsData } from "@/utils/translations";
import { languageQuestions } from "@/utils/languageQuestions";

export const useAssessmentStore = create(
  persist(
    (set, get) => ({
      // User data
      userData: null,
      setUserData: (data) => set({ userData: data }),

      // Assessment state (renamed from Test state)
      activeStep: 0,
      setActiveStep: (step) => set({ activeStep: step }),

      // Current answer
      answer: "",
      setAnswer: (text) => set({ answer: text }),

      // Language settings
      language: "english",
      setLanguage: (lang) => set({ language: lang }),

      // Questions data
      questions: [],
      setQuestions: (qs) => set({ questions: qs }),

      // Translation data
      t: translations.english,
      setT: (translation) => set({ t: translation }),

      // Question status tracking
      questionStatus: [],
      setQuestionStatus: (status) => set({ questionStatus: status }),
      updateQuestionStatus: (index, status) => {
        const currentStatus = [...get().questionStatus];
        currentStatus[index] = status;
        set({ questionStatus: currentStatus });
      },

      // Assessment results
      assessmentResults: [],
      setAssessmentResults: (results) => set({ assessmentResults: results }),
      updateAssessmentResult: (index, result) => {
        const currentResults = [...get().assessmentResults];
        currentResults[index] = result;
        set({ assessmentResults: currentResults });
      },

      // Assessment answers (fixed variable names)
      assessmentAnswers: [],
      // Make sure these functions are included in your store:

      setAssessmentAnswers: (answers) => set({ assessmentAnswers: answers }),
      setAssessmentResults: (results) => set({ assessmentResults: results }),
      resetVisibilityViolations: () => set({ visibilityViolations: 0 }),
      updateAssessmentAnswer: (index, answer) => {
        const currentAnswers = [...get().assessmentAnswers];
        currentAnswers[index] = answer;
        set({ assessmentAnswers: currentAnswers });
      },

      // Assessment failed flag (renamed from Test failed flag)
      assessmentFailed: false,
      setAssessmentFailed: (failed) => set({ assessmentFailed: failed }),

      // Assessment completion flag
      assessmentCompleted: false,
      setAssessmentCompleted: (completed) =>
        set({ assessmentCompleted: completed }),

      // Language quiz results
      languageQuizCompleted: false,
      languageQuizScore: 0,
      languageQuizResults: null,

      setLanguageQuizCompleted: (completed) =>
        set({ languageQuizCompleted: completed }),
      setLanguageQuizScore: (score) => set({ languageQuizScore: score }),
      setLanguageQuizResults: (results) =>
        set({ languageQuizResults: results }),

      // Initialize user data and related state
      initializeUserData: (userData) => {
        const lang = userData.language;
        set({
          userData,
          language: lang,
          t: translations[lang],
          questions: questionsData[lang],
          questionStatus: Array(questionsData[lang].length).fill(null),
          languageQuestions: languageQuestions[lang] || [],
        });
      },

      // Reset assessment state
      resetAssessment: () => {
        set({
          activeStep: 0,
          answer: "",
          questionStatus: Array(get().questions.length).fill(null),
          assessmentResults: [],
          assessmentAnswers: [],
          assessmentFailed: false,
          assessmentCompleted: false,
          languageQuizCompleted: false,
          languageQuizScore: 0,
          languageQuizResults: null,
        });
      },
      // Add these fields to the store state
      // Make sure these fields are properly defined in your store:

      visibilityViolations: 0,
      setVisibilityViolations: (count) => set({ visibilityViolations: count }),
      // Update the incrementVisibilityViolations function
      incrementVisibilityViolations: () => {
        // Use a callback to ensure we're working with the latest state
        set((state) => {
          const newCount = state.visibilityViolations + 1;
          console.log("Visibility violation count:", newCount);
          return { visibilityViolations: newCount };
        });
      },
      resetVisibilityViolations: () => set({ visibilityViolations: 0 }),
    }),
    {
      name: "call-center-assessment-storage",
      storage: createJSONStorage(() => sessionStorage), // Using sessionStorage for security
    }
  )
);
