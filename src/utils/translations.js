// Language translations for the application
export const translations = {
  // Add these to each language section in the translations object
  english: {
    // Get Started Page
    title: "Talk Scout",
    subtitle: "Call Center Agent Assessment",
    // Update the rules in each language section:
    
    // English
    rules: {
      title: "Examination Rules",
      rule1:
        "You cannot leave or close the tab during the test. You have 3 attempts before automatic failure.",
      rule2:
        "Each question has a specific time limit that must be strictly followed.",
      rule3: "All 5 questions must be completed in the allocated time.",
      rule4: "Your responses will be evaluated by AI for language proficiency.",
    },
    form: {
      name: "Full Name",
      namePlaceholder: "Enter your full name",
      phone: "Phone Number",
      phonePlaceholder: "Enter your phone number",
      language: "Language",
      languagePlaceholder: "Select your preferred language",
      startButton: "Start Test",
    },
    validation: {
      nameRequired: "Name must have at least 2 letters",
      phoneRequired: "Phone number must have at least 10 digits",
      languageRequired: "Please select a language",
    },

    // Test Page
    testTitle: "Talk Scout Assessment",
    question: "Question",
    of: "of",
    submitButton: "Submit Answer",
    answerPlaceholder: "Type your answer here...",
    complete: "Assessment Complete",
    completeMessage:
      "Thank you for completing the assessment. Processing your results...",
  },

  dutch: {
    // Get Started Page
    title: "Talk Scout",
    subtitle: "Callcenter Agent Beoordeling",
    rules: {
      title: "Examenregels",
      rule1:
        "U kunt het tabblad tijdens de test niet verlaten of sluiten. U heeft 3 pogingen voordat u automatisch zakt.",
      rule2:
        "Elke vraag heeft een specifieke tijdslimiet die strikt moet worden gevolgd.",
      rule3:
        "Alle 5 vragen moeten binnen de toegewezen tijd worden beantwoord.",
      rule4: "Uw antwoorden worden door AI geëvalueerd op taalvaardigheid.",
    },
    form: {
      name: "Volledige Naam",
      namePlaceholder: "Voer uw volledige naam in",
      phone: "Telefoonnummer",
      phonePlaceholder: "Voer uw telefoonnummer in",
      language: "Taal",
      languagePlaceholder: "Selecteer uw voorkeurstaal",
      startButton: "Start Test",
    },
    validation: {
      nameRequired: "Naam moet minimaal 2 letters bevatten",
      phoneRequired: "Telefoonnummer moet minimaal 10 cijfers bevatten",
      languageRequired: "Selecteer een taal",
    },

    // Test Page
    testTitle: "Talk Scout Beoordeling",
    question: "Vraag",
    of: "van",
    submitButton: "Antwoord Indienen",
    answerPlaceholder: "Typ hier uw antwoord...",
    complete: "Beoordeling Voltooid",
    completeMessage:
      "Bedankt voor het voltooien van de beoordeling. Uw resultaten worden verwerkt...",
  },

  german: {
    // Get Started Page
    title: "Talk Scout",
    subtitle: "Call-Center-Agenten Bewertung",
    rules: {
      title: "Prüfungsregeln",
      rule1:
        "Sie dürfen den Tab während des Tests nicht verlassen oder schließen. Sie haben 3 Versuche, bevor Sie automatisch durchfallen.",
      rule2:
        "Jede Frage hat ein bestimmtes Zeitlimit, das strikt eingehalten werden muss.",
      rule3:
        "Alle 5 Fragen müssen in der zugewiesenen Zeit beantwortet werden.",
      rule4: "Ihre Antworten werden von KI auf Sprachkenntnisse bewertet.",
    },
    form: {
      name: "Vollständiger Name",
      namePlaceholder: "Geben Sie Ihren vollständigen Namen ein",
      phone: "Telefonnummer",
      phonePlaceholder: "Geben Sie Ihre Telefonnummer ein",
      language: "Sprache",
      languagePlaceholder: "Wählen Sie Ihre bevorzugte Sprache",
      startButton: "Test Starten",
    },
    validation: {
      nameRequired: "Name muss mindestens 2 Buchstaben haben",
      phoneRequired: "Telefonnummer muss mindestens 10 Ziffern haben",
      languageRequired: "Bitte wählen Sie eine Sprache",
    },

    // Test Page
    testTitle: "Talk Scout Bewertung",
    question: "Frage",
    of: "von",
    submitButton: "Antwort Einreichen",
    answerPlaceholder: "Geben Sie hier Ihre Antwort ein...",
    complete: "Assessment Completed",
    completeMessage:
      "Vielen Dank für das Abschließen der Bewertung. Ihre Ergebnisse werden verarbeitet...",
  },
};

// Questions in different languages
export const questions = {
  english: [
    {
      id: 1,
      text: "How would you handle an angry customer who is complaining about a service they received?",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 2,
      text: "Explain how you would help a customer who doesn't clearly understand the product features.",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 3,
      text: "Describe a situation where you had to deal with a difficult request and how you resolved it.",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 4,
      text: "How would you respond to a customer who wants to cancel their subscription?",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 5,
      text: "What strategies would you use to ensure customer satisfaction after resolving their issue?",
      timeLimit: 360, // 6 minutes
    },
  ],

  dutch: [
    {
      id: 1,
      text: "Hoe zou u omgaan met een boze klant die klaagt over een dienst die ze hebben ontvangen?",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 2,
      text: "Leg uit hoe u een klant zou helpen die de productfuncties niet duidelijk begrijpt.",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 3,
      text: "Beschrijf een situatie waarin u te maken had met een moeilijk verzoek en hoe u het heeft opgelost.",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 4,
      text: "Hoe zou u reageren op een klant die zijn abonnement wil opzeggen?",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 5,
      text: "Welke strategieën zou u gebruiken om klanttevredenheid te garanderen na het oplossen van hun probleem?",
      timeLimit: 360, // 6 minutes
    },
  ],

  german: [
    {
      id: 1,
      text: "Wie würden Sie mit einem verärgerten Kunden umgehen, der sich über einen erhaltenen Service beschwert?",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 2,
      text: "Erklären Sie, wie Sie einem Kunden helfen würden, der die Produktfunktionen nicht klar versteht.",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 3,
      text: "Beschreiben Sie eine Situation, in der Sie mit einer schwierigen Anfrage umgehen mussten und wie Sie sie gelöst haben.",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 4,
      text: "Wie würden Sie auf einen Kunden reagieren, der sein Abonnement kündigen möchte?",
      timeLimit: 360, // 6 minutes
    },
    {
      id: 5,
      text: "Welche Strategien würden Sie anwenden, um die Kundenzufriedenheit nach der Lösung ihres Problems sicherzustellen?",
      timeLimit: 360, // 6 minutes
    },
  ],
};
