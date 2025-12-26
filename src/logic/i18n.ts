export type Language = "de" | "en-GB" | "es-ES" | "fr-FR";

export type GlossaryEntry = {
  term: string;
  description: string;
};

type Strings = {
  appTitle: string;
  appSubtitle: string;
  homeLabel: string;
  homeTitle: string;
  homeIntro: string;
  navDiagnoseAttention: string;
  startDiagnosis: string;
  startTraining: string;
  dashboardTitle: string;
  dashboardIntro: string;
  subskillsTitle: string;
  repeatDiagnosis: string;
  repeatDiagnosisConfirm: string;
  trainingTitle: string;
  trainingIntro: string;
  trainingStart: string;
  practiceNudgeTitle: string;
  practiceNudgeBody: string;
  practiceNudgeCta: string;
  backToDashboard: string;
  sessionDone: string;
  sessionSummary: (correct: number, total: number) => string;
  anotherRound: string;
  diagnosisTitle: string;
  diagnosisNudgeTitle: string;
  diagnosisNudgeBody: string;
  diagnosisNudgeCta: string;
  trainingTaskTitle: string;
  answerPlaceholder: string;
  checkLabel: string;
  confidencePrompt: string;
  confidenceHelper: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  correctLabel: string;
  almostCorrectLabel: string;
  incorrectLabel: string;
  resultLabel: string;
  correctAnswerLabel: string;
  userAnswerLabel: string;
  notSimplifiedNote: string;
  fullyCorrectLabel: string;
  correctRateLabel: string;
  confidenceRateLabel: string;
  modulePractice: string;
  subskillPractice: string;
  glossaryTitle: string;
  glossaryIntro: string;
  glossaryCta: string;
  glossaryBack: string;
  diagnosticsTitle: string;
  simplifyHuntTitle: string;
  simplifyHuntSummary: string;
  simplifyHuntPrompt: (value: string) => string;
  simplifyHuntCrossPrompt: (first: string, second: string) => string;
  simplifyHuntGood: (value: string, reduced: string) => string;
  simplifyHuntBad: (value: string) => string;
  simplifyApply: string;
  green: string;
  yellow: string;
  red: string;
};

export const strings: Record<Language, Strings> = {
  de: {
    appTitle: "Mathe-Training mit Brüchen",
    appSubtitle: "Kurz-Check, Training und Fortschritt für Bruchrechnung in Klasse 6.",
    homeLabel: "Start",
    homeTitle: "Dein Einstieg",
    homeIntro:
      "Starte mit einem kurzen Check und trainiere danach gezielt die Themen, die noch wackeln.",
    navDiagnoseAttention: "Kurz-Check empfohlen",
    startDiagnosis: "Kurz-Check starten",
    startTraining: "Trainieren",
    dashboardTitle: "Dashboard",
    dashboardIntro: "Dein aktueller Stand pro Modul.",
    subskillsTitle: "Subskills",
    repeatDiagnosis: "Kurz-Check wiederholen",
    repeatDiagnosisConfirm:
      "Kurz-Check neu starten? Dein aktueller Kurz-Check-Stand wird zurückgesetzt.",
    trainingTitle: "Training",
    trainingIntro:
      "Wir setzen den Fokus auf unsichere Themen. Eine Session hat 10 Aufgaben.",
    trainingStart: "10 Aufgaben starten",
    practiceNudgeTitle: "Freies Training",
    practiceNudgeBody: "Gemischte Aufgaben aus mehreren Modulen, angepasst an deine Schwächen.",
    practiceNudgeCta: "Training starten",
    backToDashboard: "Zurück zum Dashboard",
    sessionDone: "Session fertig",
    sessionSummary: (correct, total) => `Richtig in dieser Session: ${correct} von ${total} Aufgaben.`,
    anotherRound: "Noch eine Runde",
    diagnosisTitle: "Kurz-Check",
    diagnosisNudgeTitle: "Kurz-Check",
    diagnosisNudgeBody:
      "Hilf uns, deinen aktuellen Stand zu sehen. Der Kurz-Check dauert nur wenige Minuten.",
    diagnosisNudgeCta: "Kurz-Check starten",
    trainingTaskTitle: "Training",
    answerPlaceholder: "Antwort (z.B. 3/4 oder 1 1/2)",
    checkLabel: "Prüfen",
    confidencePrompt: "Wie sicher warst du?",
    confidenceHelper: "Wähle eine Option, um zur nächsten Aufgabe zu gehen.",
    confidenceHigh: "sehr sicher",
    confidenceMedium: "geht so",
    confidenceLow: "unsicher",
    correctLabel: "Richtig!",
    almostCorrectLabel: "Fast richtig!",
    incorrectLabel: "Noch nicht ganz.",
    resultLabel: "Ergebnis:",
    correctAnswerLabel: "Richtig wäre:",
    userAnswerLabel: "Deine Antwort:",
    notSimplifiedNote: "Aber: Das Ergebnis ist noch nicht vollständig gekürzt.",
    fullyCorrectLabel: "Vollständig korrekt:",
    correctRateLabel: "Richtig:",
    confidenceRateLabel: "Sicherheit:",
    modulePractice: "Modul üben",
    subskillPractice: "üben",
    glossaryTitle: "Mathe-Hilfe",
    glossaryIntro:
      "Kurze Erklärungen zu Begriffen und Rechenwegen aus der Bruchrechnung.",
    glossaryCta: "Begriffe & Hilfe",
    glossaryBack: "Zurück",
    diagnosticsTitle: "Aufgaben-Details",
    simplifyHuntTitle: "Kürz-Jagd",
    simplifyHuntSummary: "Kürz-Hilfe (optional)",
    simplifyHuntPrompt: (value) => `Hilfsaufgabe: Finde einen gemeinsamen Teiler für ${value}.`,
    simplifyHuntCrossPrompt: (first, second) =>
      `Hilfsaufgabe: Prüfe Kürzen über Kreuz zwischen ${first} und ${second}.`,
    simplifyHuntGood: (value, reduced) =>
      `Gut! Durch ${value} kürzen ergibt ${reduced}.`,
    simplifyHuntBad: (value) => `Durch ${value} geht hier nicht.`,
    simplifyApply: "Antwort einsetzen",
    green: "Grün",
    yellow: "Gelb",
    red: "Rot",
  },
  "en-GB": {
    appTitle: "Maths Training with Fractions",
    appSubtitle: "Quick check, practice, and progress for Year 6 fractions.",
    homeLabel: "Home",
    homeTitle: "Your starting point",
    homeIntro:
      "Begin with a quick check, then practise the topics that need more confidence.",
    navDiagnoseAttention: "Quick check recommended",
    startDiagnosis: "Start quick check",
    startTraining: "Practice",
    dashboardTitle: "Dashboard",
    dashboardIntro: "Your current status by module.",
    subskillsTitle: "Subskills",
    repeatDiagnosis: "Repeat quick check",
    repeatDiagnosisConfirm: "Restart the quick check? Your current progress will be reset.",
    trainingTitle: "Practice",
    trainingIntro:
      "We focus on the weaker topics. One session has 10 tasks.",
    trainingStart: "Start 10 tasks",
    practiceNudgeTitle: "Quick practice",
    practiceNudgeBody: "Mixed tasks across modules, adapted to your needs.",
    practiceNudgeCta: "Start practice",
    backToDashboard: "Back to dashboard",
    sessionDone: "Session complete",
    sessionSummary: (correct, total) => `Correct in this session: ${correct} of ${total} tasks.`,
    anotherRound: "Another round",
    diagnosisTitle: "Quick check",
    diagnosisNudgeTitle: "Quick check",
    diagnosisNudgeBody:
      "Help us see your current level. The quick check takes just a few minutes.",
    diagnosisNudgeCta: "Start quick check",
    trainingTaskTitle: "Practice",
    answerPlaceholder: "Answer (e.g. 3/4 or 1 1/2)",
    checkLabel: "Check",
    confidencePrompt: "How sure were you?",
    confidenceHelper: "Pick an option to continue to the next task.",
    confidenceHigh: "very sure",
    confidenceMedium: "not sure",
    confidenceLow: "unsure",
    correctLabel: "Correct!",
    almostCorrectLabel: "Almost correct!",
    incorrectLabel: "Not quite.",
    resultLabel: "Result:",
    correctAnswerLabel: "Correct answer:",
    userAnswerLabel: "Your answer:",
    notSimplifiedNote: "But: The result is not fully simplified yet.",
    fullyCorrectLabel: "Fully correct:",
    correctRateLabel: "Correct:",
    confidenceRateLabel: "Confidence:",
    modulePractice: "Practise module",
    subskillPractice: "practice",
    glossaryTitle: "Maths help",
    glossaryIntro:
      "Short explanations for key fraction terms and methods used here.",
    glossaryCta: "Terms & help",
    glossaryBack: "Back",
    diagnosticsTitle: "Task details",
    simplifyHuntTitle: "Simplify hunt",
    simplifyHuntSummary: "Simplify hint (optional)",
    simplifyHuntPrompt: (value) => `Helper: Find a common divisor for ${value}.`,
    simplifyHuntCrossPrompt: (first, second) =>
      `Helper: Check cross-cancelling between ${first} and ${second}.`,
    simplifyHuntGood: (value, reduced) =>
      `Nice! Dividing by ${value} gives ${reduced}.`,
    simplifyHuntBad: (value) => `${value} does not divide both parts.`,
    simplifyApply: "Use answer",
    green: "Green",
    yellow: "Yellow",
    red: "Red",
  },
  "es-ES": {
    appTitle: "Entrenamiento de fracciones",
    appSubtitle: "Chequeo rápido, práctica y progreso para fracciones en Year 6.",
    homeLabel: "Inicio",
    homeTitle: "Tu punto de partida",
    homeIntro:
      "Empieza con un diagnóstico breve y practica después los temas que necesitan más seguridad.",
    navDiagnoseAttention: "Chequeo recomendado",
    startDiagnosis: "Iniciar chequeo",
    startTraining: "Practicar",
    dashboardTitle: "Panel",
    dashboardIntro: "Tu estado actual por módulo.",
    subskillsTitle: "Subhabilidades",
    repeatDiagnosis: "Repetir chequeo",
    repeatDiagnosisConfirm: "¿Reiniciar el chequeo? Se borrará el progreso actual.",
    trainingTitle: "Práctica",
    trainingIntro:
      "Nos centramos en los temas más débiles. Una sesión tiene 10 tareas.",
    trainingStart: "Iniciar 10 tareas",
    practiceNudgeTitle: "Práctica rápida",
    practiceNudgeBody: "Tareas mezcladas de varios módulos, adaptadas a tus necesidades.",
    practiceNudgeCta: "Iniciar práctica",
    backToDashboard: "Volver al panel",
    sessionDone: "Sesión terminada",
    sessionSummary: (correct, total) => `Correctas en esta sesión: ${correct} de ${total} tareas.`,
    anotherRound: "Otra ronda",
    diagnosisTitle: "Chequeo rápido",
    diagnosisNudgeTitle: "Chequeo rápido",
    diagnosisNudgeBody:
      "Ayúdanos a ver tu nivel actual. El chequeo rápido tarda solo unos minutos.",
    diagnosisNudgeCta: "Iniciar chequeo",
    trainingTaskTitle: "Práctica",
    answerPlaceholder: "Respuesta (p. ej. 3/4 o 1 1/2)",
    checkLabel: "Comprobar",
    confidencePrompt: "¿Qué tan seguro estabas?",
    confidenceHelper: "Elige una opción para continuar con la siguiente tarea.",
    confidenceHigh: "muy seguro",
    confidenceMedium: "regular",
    confidenceLow: "inseguro",
    correctLabel: "¡Correcto!",
    almostCorrectLabel: "¡Casi correcto!",
    incorrectLabel: "No del todo.",
    resultLabel: "Resultado:",
    correctAnswerLabel: "Respuesta correcta:",
    userAnswerLabel: "Tu respuesta:",
    notSimplifiedNote: "Pero: El resultado aún no está completamente simplificado.",
    fullyCorrectLabel: "Totalmente correcto:",
    correctRateLabel: "Correctas:",
    confidenceRateLabel: "Confianza:",
    modulePractice: "Practicar módulo",
    subskillPractice: "practicar",
    glossaryTitle: "Ayuda de matemáticas",
    glossaryIntro:
      "Explicaciones breves de términos y métodos de fracciones usados aquí.",
    glossaryCta: "Términos y ayuda",
    glossaryBack: "Volver",
    diagnosticsTitle: "Detalles de la tarea",
    simplifyHuntTitle: "Caza de simplificación",
    simplifyHuntSummary: "Ayuda para simplificar (opcional)",
    simplifyHuntPrompt: (value) => `Ayuda: Encuentra un divisor común para ${value}.`,
    simplifyHuntCrossPrompt: (first, second) =>
      `Ayuda: Comprueba la simplificación en cruz entre ${first} y ${second}.`,
    simplifyHuntGood: (value, reduced) =>
      `¡Bien! Dividir por ${value} da ${reduced}.`,
    simplifyHuntBad: (value) => `${value} no divide ambas partes.`,
    simplifyApply: "Usar respuesta",
    green: "Verde",
    yellow: "Amarillo",
    red: "Rojo",
  },
  "fr-FR": {
    appTitle: "Entraînement aux fractions",
    appSubtitle: "Vérification rapide, entraînement et progrès pour les fractions en Year 6.",
    homeLabel: "Accueil",
    homeTitle: "Ton point de départ",
    homeIntro:
      "Commence par une vérification rapide puis entraîne-toi sur les thèmes à renforcer.",
    navDiagnoseAttention: "Vérification recommandée",
    startDiagnosis: "Démarrer la vérification",
    startTraining: "S'entraîner",
    dashboardTitle: "Tableau de bord",
    dashboardIntro: "Ton état actuel par module.",
    subskillsTitle: "Sous-compétences",
    repeatDiagnosis: "Refaire la vérification",
    repeatDiagnosisConfirm: "Recommencer la vérification ? Le progrès actuel sera réinitialisé.",
    trainingTitle: "Entraînement",
    trainingIntro:
      "Nous nous concentrons sur les thèmes les plus faibles. Une session contient 10 tâches.",
    trainingStart: "Démarrer 10 tâches",
    practiceNudgeTitle: "Entraînement rapide",
    practiceNudgeBody: "Tâches mixtes de plusieurs modules, adaptées à tes besoins.",
    practiceNudgeCta: "Démarrer l'entraînement",
    backToDashboard: "Retour au tableau",
    sessionDone: "Session terminée",
    sessionSummary: (correct, total) => `Correctes dans cette session : ${correct} sur ${total} tâches.`,
    anotherRound: "Encore une session",
    diagnosisTitle: "Vérification rapide",
    diagnosisNudgeTitle: "Vérification rapide",
    diagnosisNudgeBody:
      "Aide-nous à voir ton niveau actuel. La vérification rapide ne prend que quelques minutes.",
    diagnosisNudgeCta: "Démarrer la vérification",
    trainingTaskTitle: "Entraînement",
    answerPlaceholder: "Réponse (ex. 3/4 ou 1 1/2)",
    checkLabel: "Vérifier",
    confidencePrompt: "À quel point étais-tu sûr(e) ?",
    confidenceHelper: "Choisis une option pour passer à la tâche suivante.",
    confidenceHigh: "très sûr(e)",
    confidenceMedium: "moyen",
    confidenceLow: "pas sûr(e)",
    correctLabel: "Correct !",
    almostCorrectLabel: "Presque correct !",
    incorrectLabel: "Pas tout à fait.",
    resultLabel: "Résultat :",
    correctAnswerLabel: "Réponse correcte :",
    userAnswerLabel: "Ta réponse :",
    notSimplifiedNote: "Mais : le résultat n'est pas encore complètement simplifié.",
    fullyCorrectLabel: "Totalement correct :",
    correctRateLabel: "Correctes :",
    confidenceRateLabel: "Confiance :",
    modulePractice: "S'entraîner au module",
    subskillPractice: "s'entraîner",
    glossaryTitle: "Aide maths",
    glossaryIntro:
      "Explications courtes des termes et méthodes de fractions utilisés ici.",
    glossaryCta: "Termes et aide",
    glossaryBack: "Retour",
    diagnosticsTitle: "Détails de la tâche",
    simplifyHuntTitle: "Chasse à la simplification",
    simplifyHuntSummary: "Aide à la simplification (optionnel)",
    simplifyHuntPrompt: (value) => `Aide : trouve un diviseur commun pour ${value}.`,
    simplifyHuntCrossPrompt: (first, second) =>
      `Aide : vérifie la réduction en croix entre ${first} et ${second}.`,
    simplifyHuntGood: (value, reduced) =>
      `Bien ! Diviser par ${value} donne ${reduced}.`,
    simplifyHuntBad: (value) => `${value} ne divise pas les deux parties.`,
    simplifyApply: "Utiliser la réponse",
    green: "Vert",
    yellow: "Jaune",
    red: "Rouge",
  },
};

export const glossary: Record<Language, GlossaryEntry[]> = {
  de: [
    {
      term: "Zähler",
      description: "Die Zahl oben im Bruch. Sie zeigt, wie viele Teile gemeint sind.",
    },
    {
      term: "Nenner",
      description: "Die Zahl unten im Bruch. Sie zeigt, in wie viele Teile das Ganze geteilt ist.",
    },
    {
      term: "Kürzen",
      description:
        "Zähler und Nenner durch den gleichen Teiler teilen, um den Bruch zu vereinfachen.",
    },
    {
      term: "Über Kreuz kürzen",
      description:
        "Vor dem Multiplizieren gemeinsame Teiler zwischen Zähler und gegenüberliegendem Nenner nutzen.",
    },
    {
      term: "Kehrwert",
      description:
        "Bruch umdrehen: aus a/b wird b/a. Beim Dividieren mit Brüchen wird mit dem Kehrwert multipliziert.",
    },
    {
      term: "Gemischte Zahl",
      description:
        "Ganzzahl plus Bruch, z.B. 1 1/2. Umrechnen zu einem unechten Bruch hilft beim Rechnen.",
    },
    {
      term: "Zahl gesucht",
      description:
        "Eine Zahl fehlt in der Rechnung. Man stellt die Gleichung um, um sie zu finden.",
    },
  ],
  "en-GB": [
    {
      term: "Numerator",
      description: "The top number of a fraction, showing how many parts we have.",
    },
    {
      term: "Denominator",
      description: "The bottom number of a fraction, showing how many equal parts make the whole.",
    },
    {
      term: "Simplify",
      description:
        "Divide numerator and denominator by the same factor to keep the value but make it simpler.",
    },
    {
      term: "Cross-cancel",
      description:
        "Before multiplying, cancel common factors between a numerator and the opposite denominator.",
    },
    {
      term: "Reciprocal",
      description:
        "Flip a fraction: a/b becomes b/a. Dividing by a fraction means multiplying by its reciprocal.",
    },
    {
      term: "Mixed number",
      description:
        "A whole number plus a fraction, e.g. 1 1/2. Convert to an improper fraction to calculate.",
    },
    {
      term: "Missing number",
      description:
        "A number is missing in the equation. Rearrange the equation to solve for it.",
    },
  ],
  "es-ES": [
    {
      term: "Numerador",
      description: "El número de arriba en una fracción, indica cuántas partes hay.",
    },
    {
      term: "Denominador",
      description: "El número de abajo, indica en cuántas partes se divide el todo.",
    },
    {
      term: "Simplificar",
      description:
        "Dividir numerador y denominador por el mismo factor para obtener una fracción equivalente.",
    },
    {
      term: "Simplificar en cruz",
      description:
        "Antes de multiplicar, cancelar factores comunes entre un numerador y el denominador opuesto.",
    },
    {
      term: "Recíproco",
      description:
        "Invertir una fracción: a/b se convierte en b/a. Dividir por una fracción es multiplicar por su recíproco.",
    },
    {
      term: "Número mixto",
      description:
        "Un número entero más una fracción, por ejemplo 1 1/2. Conviene convertir a fracción impropia.",
    },
    {
      term: "Número desconocido",
      description:
        "Falta un número en la ecuación. Se reorganiza la ecuación para encontrarlo.",
    },
  ],
  "fr-FR": [
    {
      term: "Numérateur",
      description: "Le nombre du haut d'une fraction, il indique le nombre de parts.",
    },
    {
      term: "Dénominateur",
      description: "Le nombre du bas, il indique en combien de parts le tout est découpé.",
    },
    {
      term: "Simplifier",
      description:
        "Diviser le numérateur et le dénominateur par le même facteur pour obtenir une fraction équivalente.",
    },
    {
      term: "Réduction en croix",
      description:
        "Avant de multiplier, réduire les facteurs communs entre un numérateur et le dénominateur opposé.",
    },
    {
      term: "Inverse",
      description:
        "Retourner une fraction : a/b devient b/a. Diviser par une fraction revient à multiplier par son inverse.",
    },
    {
      term: "Nombre mixte",
      description:
        "Un entier plus une fraction, par ex. 1 1/2. Le convertir en fraction impropre aide à calculer.",
    },
    {
      term: "Nombre manquant",
      description:
        "Un nombre manque dans l'équation. On réarrange l'équation pour le trouver.",
    },
  ],
};

export const getLanguageLabel = (lang: Language): string =>
  lang === "de" ? "DE" : lang === "en-GB" ? "EN" : lang === "es-ES" ? "ES" : "FR";

export const languageOrder: Language[] = ["de", "en-GB", "es-ES", "fr-FR"];
