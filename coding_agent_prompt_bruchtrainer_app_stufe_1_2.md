# Coding-Agent Prompt – Bruchtrainer-App (Klasse 6, Hamburg)

*(Pflichtenheft + Agent-Prompt in einem Dokument; Ausgabe/Weitergabe an Coding-Agent vorgesehen)*

## 0. Ziel

Baue eine Lern-App für **Mathematik Klasse 6 (Gymnasium, Hamburg)** mit Fokus auf **Bruchrechnung**. Inhalte orientieren sich an den abfotografierten Buchseiten (Brüche multiplizieren) und werden erweitert um:

- **Division von Brüchen** (inkl. Kehrwert-Regel)
- **Kürzen (Vereinfachen) systematisch beim Rechnen** (vor/nach der Multiplikation/Division, „über Kreuz“).

Die App hat **zwei Kernstufen**:

1. **Diagnose & Selbsteinschätzung** (Schüler*in sieht, was schon sicher ist vs. wo Übung nötig ist)
2. **Gezieltes spielerisches Training** der problematischen Bereiche (adaptiv).

Nicht-Ziele (v1): Kontoverwaltung, Multiplayer, umfangreiche Gamification-Ökonomie, komplexe Analytics-Backends.

---

## 1. Zielgruppe & UX-Leitlinien

- Primärnutzer: **12 Jahre**, 6. Klasse.
- UX: **ruhig, klar, wenig Ablenkung**, kurze Texte, visuelle Hilfen.
- Motivation: Fortschritt sichtbar, **keine Strafen**, Fehler als Lernsignal.

---

## 2. Inhaltlicher Scope (v1)

### 2.1 Themenmodule

Die App muss mindestens diese Module abdecken:

**A. Brüche: Grundlagen & Darstellung**

- Bruch als Teil eines Ganzen (Fläche/Kreis), „von“-Bedeutung

**B. Multiplikation von Brüchen**

- Regel: Zähler×Zähler, Nenner×Nenner
- Darstellung mit Bildern („Rechnung in Bildern“)

**C. Division von Brüchen**

- Regel: durch einen Bruch teilen = mit dem Kehrwert multiplizieren
- Bedeutung in einfachen Kontexten ("Wie oft passt 1/3 in 2/3?")

**D. Sonderfälle**

- Bruch ×/÷ ganze Zahl
- Bruch ×/÷ 1
- 0 und 1 als Ausnahmen/Ankerfälle

**E. Gemischte Zahlen**

- Umwandlung: gemischt → unechter Bruch
- Multiplikation/Division gemischter Zahlen

**F. Kürzen & Vereinfachen**

- Kürzen als Konzept (gemeinsamer Teiler)
- Kürzen **vor** der Multiplikation/Division („über Kreuz“)
- Ergebnis vollständig gekürzt

**G. Zahl gesucht**

- fehlender Faktor/Divisor: □ · a = b, □ : a = b, a : □ = b

**H. Anteile & Textaufgaben**

- „x von y“ (Multiplikation)
- „y geteilt durch x“ (Division)
- Größen (m, h, km etc.)

**I. Vergleich natürliche Zahlen vs. Brüche**

- Produkt/Quotient kann kleiner als ein Faktor sein

---

## 3. Lernlogik (Pflichtenheft)

### 3.1 Stufe 1: Diagnose & Selbsteinschätzung

**Ziel:** Schüler*in erkennt pro Thema den Stand: **grün/gelb/rot**.

**Ablauf:**

1. Onboarding: kurzer Hinweis „Wir finden heraus, was du schon kannst.“
2. Pro Modul 4–8 Aufgaben (repräsentativ; Mischung aus leicht/mittel)
3. Nach jeder Aufgabe:
   - Korrektheit anzeigen
   - **Selbsteinschätzung** abfragen: „sehr sicher / geht so / unsicher“
4. Nach Abschluss: Dashboard mit Ampel je Modul.

**Bewertungskriterium pro Modul (Vorschlag, implementierbar):**

- Score = Kombination aus:
  - correctness\_rate (0..1)
  - confidence\_rate (Anteil „sehr sicher“)
  - optional: median\_time (nur als weiches Signal)

**Ampel-Logik (einfach, deterministisch):**

- **Grün**: correctness ≥ 0.8 **und** confidence ≥ 0.6
- **Gelb**: correctness ≥ 0.6 sonst
- **Rot**: correctness < 0.6

App muss die Schwachstellen auch feiner markieren (Subskills):

- z.B. in Modul „Kürzen“ unterscheiden: (1) Teiler finden, (2) über Kreuz kürzen, (3) am Ende kürzen.

### 3.2 Stufe 2: Adaptives, spielerisches Training

**Ziel:** Rot/Gelb-Themen verbessern, bis sie stabil Grün sind.

**Mechanik:**

- Training-Sessions 5–8 Minuten
- Aufgabenpool pro Subskill
- Adaptive Auswahl:
  - erhöhe Wahrscheinlichkeit für Subskills mit Fehlern/Unsicherheit
  - sobald Stabilität erreicht: weniger Wiederholung

**Mastery-Regel (Vorschlag):**

- Subskill ist „gemeistert“, wenn in den letzten 10 Aufgaben:
  - ≥ 8 richtig und
  - ≥ 5 mal „sehr sicher“

---

## 4. Aufgaben-Engine (Anforderungen)

### 4.1 Aufgabentypen

Unterstütze mindestens folgende Typen:

1. **Multiple Choice** (für Einstieg/Detektivmodus)
2. **Freitext** (Bruch als Eingabe, z.B. „3/4“; optional gemischte Zahl „1 1/2“)
3. **Interaktive Visual-Aufgabe** (MVP: simple Auswahl/Markierung; kein komplexes Zeichnen nötig)

### 4.2 Bruch-Eingabe & Parsing

- Erlaube Eingaben:
  - `a/b`
  - `a b/c` (gemischt)
  - Ganze Zahl `a`
- Normalisiere intern auf rationales Format: numerator, denominator (BigInt oder int)
- Validierung: denominator ≠ 0

### 4.3 Automatisches Kürzen

Die Engine muss:

- Ergebnisse immer in gekürzter Form darstellen
- optionalen „Kürz-Hinweis“ geben, wenn Nutzer nicht gekürzt hat
- beim Üben von Kürzen auch Zwischenschritte prüfen (siehe 5.3).

### 4.4 Schritt-für-Schritt-Erklärung (Scaffold)

Mindestens für folgende Fehlerfälle:

- Kehrwert-Regel bei Division
- Umwandlung gemischter Zahlen
- Kürzen (Teiler finden) / über Kreuz

Erklärungen kurz, maximal 3–5 Schritte, mit optionalem „mehr anzeigen“.

---

## 5. Spezielles Modul: „Kürzen beim Rechnen“ (MUSS)

### 5.1 Lernziele

- Erkennen gemeinsamer Faktoren
- Kürzen vor dem Multiplizieren/Dividieren („über Kreuz“)
- Ergebnis vollständig kürzen

### 5.2 Übungsmodi

1. **Kürz-Jagd**: Nutzer markiert kürzbare Paare (z.B. 6 mit 9) und wählt Teiler
2. **Über-Kreuz-Kürzen**: Bei `a/b × c/d` darf Nutzer `a` mit `d` oder `c` mit `b` kürzen
3. **Final-Kürzen**: Nutzer muss ein bereits berechnetes Ergebnis kürzen

### 5.3 Bewertung

- nicht nur Endergebnis, sondern auch Prozess:
  - akzeptiere mehrere gültige Kürzwege
  - logge, ob Kürzen genutzt wurde

---

## 6. UI-Wireframe (essentiell, low-detail)

### 6.1 Screens

1. **Home**

   - Buttons: „Diagnose starten“, „Trainieren“, „Fortschritt“
   - Anzeige: „Heute: X Minuten“ (optional)

2. **Diagnose – Aufgaben-Screen**

   - Oben: Modulname + Fortschritt (z.B. 3/6)
   - Mitte: Aufgabe (Text/Visual)
   - Unten: Eingabe + „Prüfen“
   - Danach: Feedback + kurzer Lösungsweg (optional)
   - Danach Pflicht: „Wie sicher warst du?“ (3 Optionen)

3. **Dashboard (Ampel)**

   - Liste Module mit 🟢🟡🔴
   - Klick auf Modul → Subskills + Empfehlung „Trainieren“

4. **Training – Session Start**

   - „Heute üben wir: …“ (aus roten/gelben Subskills)
   - Button „Start 6-Minuten-Session“

5. **Training – Spielmodus**

   - Eine der Mini-Mechaniken (Detektivmodus / Kürz-Jagd / Werkstatt)
   - Sofortfeedback, kurze Hinweise

6. **Ergebnis / Review**

   - „Du hast verbessert: …“
   - „Nächstes Ziel: …“

---

## 7. Datenmodell (MVP)

### 7.1 Entities

- `UserProfile` (lokal, nur 1 Nutzer in v1 ok)
- `Module` {id, title}
- `Subskill` {id, moduleId, title}
- `TaskTemplate` {id, subskillId, type, generatorParams}
- `TaskInstance` {seed, renderedPrompt, correctAnswer, steps(optional)}
- `Attempt` {taskId, isCorrect, userAnswer, timeMs, confidence, timestamp, usedSimplificationHints?}

### 7.2 Persistenz

- Local-first (z.B. IndexedDB/SQLite je nach Plattform)

---

## 8. Generierung von Aufgaben (Anforderungen)

- Aufgaben müssen **parameterisiert** sein (Seeds), um Wiederholung zu vermeiden.
- Schwierigkeitsstufen:
  - Level 1: kleine Zahlen, Kürzen einfach
  - Level 2: mittlere Zahlen, über Kreuz sinnvoll
  - Level 3: gemischte Zahlen + Division + Text

**Beispiele (Generator-Spezifikation):**

- Multiply: `(a/b) × (c/d)` mit gcd-gesteuerter Wahrscheinlichkeit für Kürzen
- Divide: `(a/b) ÷ (c/d)` und optional gemischt
- Mixed: `m n/p` → `(m*p+n)/p`
- Missing number: `□ × a/b = c/d` oder `a/b ÷ □ = c/d`
- Word problems: Templates mit Einheiten (m, km, h)

---

## 9. Qualitätsanforderungen

- Jede Aufgabe hat eindeutige Korrektheitsprüfung
- Brüche werden intern exakt gerechnet (keine Floating Points)
- Ergebnisdarstellung immer gekürzt
- Accessibility: große Schrift, klare Kontraste, offline-fähig (optional)

---

## 10. Akzeptanzkriterien (Definition of Done)

1. Diagnose-Stufe liefert Dashboard mit 🟢🟡🔴 pro Modul
2. App erkennt mindestens 5 Subskills als „problematisch“ und priorisiert sie im Training
3. Training-Sessions adaptieren Aufgaben basierend auf Attempts
4. Division von Brüchen inkl. Kehrwert wird erklärt und geübt
5. Kürzen wird explizit geübt (mind. 3 Übungsmodi) und im Rechnen berücksichtigt
6. Persistente Speicherung des Fortschritts lokal

---

## 11. Tech-Vorschlag (frei wählbar durch Agent)

Erlaubt:

- Web-App: React/Next.js oder Vue
- Mobile: Flutter oder React Native

MVP empfohlen: Web-App (React) + lokale Persistenz.

---

## 12. Konkrete Coding-Agent-Aufgabe (Prompt)

**Du bist ein Coding-Agent. Implementiere eine MVP-Lern-App gemäß Spezifikation.**

### Lieferumfang (Repository)

- `README.md` mit Setup, Run, Build
- UI: Screens aus Abschnitt 6
- Core: Bruch-Engine (Parsing, Kürzen, Multiplizieren, Dividieren)
- Task-Generatoren für mind. 6 Subskills inkl. Division & Kürzen
- Fortschrittslogik (Ampel + Mastery)
- Lokale Speicherung

### Muss-Funktionen

- `parseFraction(input: string) -> {num, den}` inkl. gemischter Zahlen
- `simplify(num, den) -> {num, den}` via gcd
- `mul(a,b)` / `div(a,b)` exakt
- Evaluator, der Nutzerantworten normalisiert und prüft
- Adaptive Task-Auswahl (gewichtete Auswahl nach Schwächen)

### UI Minimalanforderungen

- Diagnose: Aufgabe → Antwort prüfen → Feedback → Selbsteinschätzung
- Dashboard: Module Ampel + Drill-down Subskills
- Training: Session (6 Minuten oder 10 Aufgaben) aus roten/gelben Subskills
- Kürzen-Training: eigener Modus (mind. 1 Mini-Game in MVP)

### Testanforderungen

- Unit-Tests für Bruch-Arithmetik, Parsing, Simplify, Division

### Grenzen (MVP)

- Nur 1 lokales Profil
- Keine Login-/Cloud-Funktion
- Visual-Aufgaben dürfen simpel sein (z.B. vorgerenderte SVG/Canvas Flächen)

---

## 13. Hinweise zur Aufgabenabdeckung der Fotos

Die Buchseiten enthalten u.a.:

- „Rechnung in Bildern“ (von-Bruch)
- „Sonderfälle“
- „Produkt zweier Brüche“
- „Zahl gesucht“
- „Gemischte Zahlen“
- „Besondere Ergebnisse“
- „Anteile berechnen“
- „Natürliche Zahlen und Brüche im Vergleich“
- Textaufgabe (z.B. „Fahrschülerinnen“)

Die App soll die Struktur spiegeln: zuerst Diagnose über alle Bereiche, dann gezieltes Training.

---

## 14. Subskills (IDs, Definitionen, Generator-Parameter)

**Ziel:** Der Agent soll klar implementieren können, *welche* Teilkompetenzen getrackt werden und *wie* Aufgaben dazu generiert werden.

### 14.1 Namenskonvention

- `moduleId`: `M_*`
- `subskillId`: `S_*`

### 14.2 Module & Subskills

#### M\_VISUAL – Rechnung in Bildern / „von“ verstehen

- **S\_VIS\_01**: „x von y“ als Flächenmodell interpretieren (rechteckiges Raster)
  - Generator: `gridCols ∈ {4,5,6}`, `gridRows ∈ {3,4}`, `frac1`, `frac2` mit Nenner passend zu Raster
- **S\_VIS\_02**: „x von y“ als Kreisdiagramm interpretieren (Sektoren)
  - Generator: `sectors ∈ {8,10,12}`, `frac1` und `frac2` kompatibel

#### M\_MUL – Multiplikation von Brüchen

- **S\_MUL\_01**: Regel anwenden (Z×Z / N×N), kleine Zahlen, keine Kürzung nötig
  - Generator: Nenner ≤ 8, gcd=1, Ergebnis bereits gekürzt
- **S\_MUL\_02**: Kürzen *nach* der Multiplikation (gcd(result)>1)
  - Generator: Nenner ≤ 12, erzwinge gcd(numer,denom) > 1
- **S\_MUL\_03**: Über-Kreuz-Kürzen *vor* der Multiplikation (didaktisch „Würzen liegt im Kürzen“)
  - Generator: konstruierte Paare, z.B. `a/b × c/d` mit gcd(a,d)>1 oder gcd(c,b)>1

#### M\_DIV – Division von Brüchen

- **S\_DIV\_01**: Kehrwert-Regel anwenden (`a/b ÷ c/d = a/b × d/c`), einfache Werte
  - Generator: Nenner ≤ 9, c≠0, d≠0, Ergebnis positiv
- **S\_DIV\_02**: Division mit notwendigem Kürzen (vor oder nach Kehrwert)
  - Generator: erzwinge Kürzchance nach Invertierung, z.B. gcd(a,c)>1 oder gcd(b,d)>1
- **S\_DIV\_03**: Bedeutung „Wie oft passt … in …?“ (Quotient als Anzahl/Skalierung)
  - Generator: Werte so wählen, dass Ergebnis ganzzahlig oder einfacher Bruch ist

#### M\_MIXED – Gemischte Zahlen

- **S\_MIX\_01**: Gemischte Zahl → unechter Bruch korrekt umwandeln
  - Generator: `whole ∈ [1..4]`, `n/d` proper, d≤9
- **S\_MIX\_02**: Multiplikation gemischter Zahlen (erst umwandeln, dann mul)
  - Generator: 1 gemischt × Bruch oder gemischt × gemischt, moderate Zahlen
- **S\_MIX\_03**: Division gemischter Zahlen (erst umwandeln, dann div)
  - Generator: wie oben, Ergebnis nicht zu komplex (Nenner ≤ 30)

#### M\_SIMPLIFY – Kürzen & Vereinfachen (explizites Training)

- **S\_SIM\_01**: Gemeinsamen Teiler finden und kürzen (ein Bruch)
  - Generator: `num,den` beide durch k∈{2,3,4,5,6} teilbar
- **S\_SIM\_02**: „Über Kreuz“ kürzen bei `a/b × c/d`
  - Generator: erzwinge gcd(a,d)>1 oder gcd(b,c)>1
- **S\_SIM\_03**: „Über Kreuz“ kürzen bei `a/b ÷ c/d` (nach Kehrwert)
  - Generator: erst invertieren, dann Kreuz-Kürzung erzwingen

#### M\_SPECIAL – Sonderfälle & besondere Ergebnisse

- **S\_SPC\_01**: Multiplizieren/Dividieren mit 1 (Identität)
  - Generator: zufälliger Bruch, Operation mit 1
- **S\_SPC\_02**: Multiplizieren/Dividieren mit ganzer Zahl (als Bruch darstellen)
  - Generator: integer 2..9, zufälliger Bruch
- **S\_SPC\_03**: „Besondere Ergebnisse“: Produkt/Quotient = 1 oder = ganze Zahl
  - Generator: konstruiere inverse Brüche / teilende Brüche

#### M\_MISSING – Zahl gesucht

- **S\_MIS\_01**: Fehlender Faktor (□ × a/b = c/d)
- **S\_MIS\_02**: Fehlender Divisor (a/b ÷ □ = c/d)
- **S\_MIS\_03**: Fehlender Dividend (□ ÷ a/b = c/d)
  - Generator: konstruiere so, dass □ als Bruch mit kleinen Nennern entsteht

#### M\_APPLY – Anteile & Textaufgaben

- **S\_APP\_01**: „x von y“ mit Einheiten (m, km, h)
- **S\_APP\_02**: Division im Kontext („aufteilen“, „wie oft passt…“)
- **S\_APP\_03**: Kombiaufgaben (zwei Schritte: umwandeln + Operation)
  - Generator: kurze, eindeutige Texte; Ergebnis als gekürzter Bruch oder einfache Dezimalzahl vermeiden (bei Bedarf Bruch belassen)

### 14.3 Didaktische Constraints (MUSS)

- Jede Aufgabe muss **eindeutig** sein (kein Interpretationsspielraum).
- Zahlenräume so wählen, dass Rechenweg im Kopf/auf Papier machbar ist:
  - Diagnose: meist Nenner ≤ 12
  - Training: progressiv bis Nenner ≤ 30
- Kürzen soll **sichtbar nützlich** sein: Aufgaben so konstruieren, dass Kürzen Arbeit spart.
- Textaufgaben nur mit **klarer Operation** (keine „Tricktexte“).

---

## 15. Seed-Aufgaben als JSON (didaktisch kuratiert) + Verifikation

**Ziel:** Der Agent kann sofort UI/Flow testen und gleichzeitig per Build-Step sicherstellen, dass Aufgaben korrekt sind.

### 15.1 JSON-Schema (MVP)

Jede Aufgabe ist ein Objekt:

- `id`: string
- `moduleId`: string
- `subskillId`: string
- `type`: `"free" | "mc" | "visual"`
- `prompt`: string
- `answer`: `{ num: int, den: int }` **gekürzt**
- `distractors` (optional für MC): Array von `{num,den}`
- `steps` (optional): Array kurzer Strings
- `tags`: Array (z.B. `["simplify","invert"]`)

### 15.2 Beispiel-Seed-Daten (20 Aufgaben)

```json
[
  {
    "id": "T_MUL_001",
    "moduleId": "M_MUL",
    "subskillId": "S_MUL_01",
    "type": "free",
    "prompt": "Berechne: 2/3 · 3/5",
    "answer": {"num": 2, "den": 5},
    "steps": ["Zähler mal Zähler: 2·3=6", "Nenner mal Nenner: 3·5=15", "Kürzen: 6/15 = 2/5"],
    "tags": ["multiply","simplify"]
  },
  {
    "id": "T_MUL_002",
    "moduleId": "M_MUL",
    "subskillId": "S_MUL_03",
    "type": "free",
    "prompt": "Berechne mit Kürzen: 6/7 · 14/15",
    "answer": {"num": 4, "den": 5},
    "steps": ["Über Kreuz kürzen: 6 mit 15 durch 3 → 2 und 5", "Über Kreuz kürzen: 14 mit 7 → 2 und 1", "Multiplizieren: (2·2)/(1·5)=4/5"],
    "tags": ["multiply","cross-simplify"]
  },
  {
    "id": "T_MUL_003",
    "moduleId": "M_MUL",
    "subskillId": "S_MUL_02",
    "type": "mc",
    "prompt": "Berechne: 3/8 · 4/9",
    "answer": {"num": 1, "den": 6},
    "distractors": [{"num": 1, "den": 12}, {"num": 12, "den": 72}, {"num": 3, "den": 18}],
    "steps": ["Multiplizieren: 12/72", "Kürzen: 12/72 = 1/6"],
    "tags": ["multiply","simplify"]
  },
  {
    "id": "T_DIV_001",
    "moduleId": "M_DIV",
    "subskillId": "S_DIV_01",
    "type": "free",
    "prompt": "Berechne: 3/4 ÷ 2/5",
    "answer": {"num": 15, "den": 8},
    "steps": ["Kehrwert nehmen: 2/5 → 5/2", "Multiplizieren: 3/4 · 5/2 = 15/8"],
    "tags": ["divide","invert"]
  },
  {
    "id": "T_DIV_002",
    "moduleId": "M_DIV",
    "subskillId": "S_DIV_02",
    "type": "free",
    "prompt": "Berechne mit Kürzen: 8/9 ÷ 4/15",
    "answer": {"num": 10, "den": 3},
    "steps": ["Kehrwert: 4/15 → 15/4", "Über Kreuz kürzen: 8 mit 4 → 2 und 1", "Über Kreuz kürzen: 15 mit 9 → 5 und 3", "Multiplizieren: (2·5)/(3·1)=10/3"],
    "tags": ["divide","invert","cross-simplify"]
  },
  {
    "id": "T_DIV_003",
    "moduleId": "M_DIV",
    "subskillId": "S_DIV_03",
    "type": "mc",
    "prompt": "Wie oft passt 1/6 in 2/3? (Rechnung: 2/3 ÷ 1/6)",
    "answer": {"num": 4, "den": 1},
    "distractors": [{"num": 1, "den": 4}, {"num": 3, "den": 12}, {"num": 2, "den": 9}],
    "steps": ["2/3 ÷ 1/6 = 2/3 · 6/1", "Kürzen: 6 mit 3 → 2 und 1", "= 2·2 = 4"],
    "tags": ["divide","interpretation","simplify"]
  },
  {
    "id": "T_SIM_001",
    "moduleId": "M_SIMPLIFY",
    "subskillId": "S_SIM_01",
    "type": "free",
    "prompt": "Kürze vollständig: 18/24",
    "answer": {"num": 3, "den": 4},
    "steps": ["Gemeinsamer Teiler 6", "18/24 = 3/4"],
    "tags": ["simplify"]
  },
  {
    "id": "T_SIM_002",
    "moduleId": "M_SIMPLIFY",
    "subskillId": "S_SIM_02",
    "type": "free",
    "prompt": "Berechne mit Über-Kreuz-Kürzen: 9/14 · 7/12",
    "answer": {"num": 3, "den": 8},
    "steps": ["Kürzen: 7 mit 14 → 1 und 2", "Kürzen: 9 mit 12 → 3 und 4", "= (3·1)/(2·4)=3/8"],
    "tags": ["cross-simplify","multiply"]
  },
  {
    "id": "T_SIM_003",
    "moduleId": "M_SIMPLIFY",
    "subskillId": "S_SIM_03",
    "type": "free",
    "prompt": "Berechne mit Kürzen: 5/6 ÷ 10/9",
    "answer": {"num": 3, "den": 4},
    "steps": ["Kehrwert: 10/9 → 9/10", "Über Kreuz kürzen: 5 mit 10 → 1 und 2", "Über Kreuz kürzen: 9 mit 6 → 3 und 2", "= (1·3)/(2·2)=3/4"],
    "tags": ["divide","invert","cross-simplify"]
  },
  {
    "id": "T_MIX_001",
    "moduleId": "M_MIXED",
    "subskillId": "S_MIX_01",
    "type": "mc",
    "prompt": "Wandle um: 2 3/5 als unechter Bruch",
    "answer": {"num": 13, "den": 5},
    "distractors": [{"num": 11, "den": 5}, {"num": 10, "den": 5}, {"num": 2, "den": 8}],
    "steps": ["2 = 10/5", "10/5 + 3/5 = 13/5"],
    "tags": ["mixed-to-improper"]
  },
  {
    "id": "T_MIX_002",
    "moduleId": "M_MIXED",
    "subskillId": "S_MIX_02",
    "type": "free",
    "prompt": "Berechne: 1 1/2 · 2/3",
    "answer": {"num": 1, "den": 1},
    "steps": ["1 1/2 = 3/2", "3/2 · 2/3", "Kürzen: 3 mit 3 → 1 und 1, 2 mit 2 → 1 und 1", "= 1"],
    "tags": ["mixed","multiply","cross-simplify"]
  },
  {
    "id": "T_MIX_003",
    "moduleId": "M_MIXED",
    "subskillId": "S_MIX_03",
    "type": "free",
    "prompt": "Berechne: 3 1/4 ÷ 1/2",
    "answer": {"num": 13, "den": 2},
    "steps": ["3 1/4 = 13/4", "÷ 1/2 = · 2/1", "13/4 · 2/1 = 26/4 = 13/2"],
    "tags": ["mixed","divide","invert","simplify"]
  },
  {
    "id": "T_SPC_001",
    "moduleId": "M_SPECIAL",
    "subskillId": "S_SPC_01",
    "type": "mc",
    "prompt": "Berechne: 7/9 · 1",
    "answer": {"num": 7, "den": 9},
    "distractors": [{"num": 7, "den": 10}, {"num": 9, "den": 7}, {"num": 1, "den": 9}],
    "steps": ["Mit 1 multiplizieren verändert nicht."],
    "tags": ["identity"]
  },
  {
    "id": "T_SPC_002",
    "moduleId": "M_SPECIAL",
    "subskillId": "S_SPC_02",
    "type": "free",
    "prompt": "Berechne: 5/6 · 3",
    "answer": {"num": 5, "den": 2},
    "steps": ["3 = 3/1", "5/6 · 3/1 = 15/6 = 5/2"],
    "tags": ["multiply","integer-as-fraction","simplify"]
  },
  {
    "id": "T_SPC_003",
    "moduleId": "M_SPECIAL",
    "subskillId": "S_SPC_03",
    "type": "free",
    "prompt": "Berechne: 4/7 ÷ 4/7",
    "answer": {"num": 1, "den": 1},
    "steps": ["Durch sich selbst teilen ergibt 1 (wenn nicht 0).", "4/7 ÷ 4/7 = 4/7 · 7/4 = 1"],
    "tags": ["special-result","divide","invert"]
  },
  {
    "id": "T_MIS_001",
    "moduleId": "M_MISSING",
    "subskillId": "S_MIS_01",
    "type": "free",
    "prompt": "Zahl gesucht: □ · 2/3 = 5/6",
    "answer": {"num": 5, "den": 4},
    "steps": ["□ = 5/6 ÷ 2/3", "= 5/6 · 3/2 = 15/12 = 5/4"],
    "tags": ["missing","divide","invert","simplify"]
  },
  {
    "id": "T_MIS_002",
    "moduleId": "M_MISSING",
    "subskillId": "S_MIS_02",
    "type": "free",
    "prompt": "Zahl gesucht: 3/5 ÷ □ = 9/10",
    "answer": {"num": 2, "den": 3},
    "steps": ["3/5 ÷ □ = 9/10 ⇒ □ = 3/5 ÷ 9/10 ? Nein: Umstellen: □ = 3/5 ÷ 9/10 ist falsch.", "Richtig: (3/5) ÷ □ = 9/10 ⇒ (3/5) = (9/10) · □ ⇒ □ = (3/5) ÷ (9/10)", "= 3/5 · 10/9 = 30/45 = 2/3"],
    "tags": ["missing","rearrange","divide","invert","simplify"]
  },
  {
    "id": "T_APP_001",
    "moduleId": "M_APPLY",
    "subskillId": "S_APP_01",
    "type": "free",
    "prompt": "Berechne: 3/4 von 2 Stunden (Ergebnis als Bruchteil einer Stunde)",
    "answer": {"num": 3, "den": 2},
    "steps": ["3/4 von 2 = 3/4 · 2/1 = 6/4 = 3/2"],
    "tags": ["word","multiply","units","simplify"]
  },
  {
    "id": "T_APP_002",
    "moduleId": "M_APPLY",
    "subskillId": "S_APP_02",
    "type": "free",
    "prompt": "Eine Strecke ist 2/3 km lang. Ein Abschnitt ist 1/6 km. Wie viele solche Abschnitte passen hinein?",
    "answer": {"num": 4, "den": 1},
    "steps": ["2/3 ÷ 1/6 = 2/3 · 6 = 4"],
    "tags": ["word","divide","interpretation"]
  },
  {
    "id": "T_APP_003",
    "moduleId": "M_APPLY",
    "subskillId": "S_APP_03",
    "type": "free",
    "prompt": "Du hast 1 1/2 Liter Saft. Du füllst ihn in Flaschen zu je 3/4 Liter. Wie viele Flaschen kannst du füllen?",
    "answer": {"num": 2, "den": 1},
    "steps": ["1 1/2 = 3/2", "3/2 ÷ 3/4 = 3/2 · 4/3", "Kürzen: 3 mit 3 → 1 und 1", "= 4/2 = 2"],
    "tags": ["word","mixed","divide","invert","cross-simplify"]
  }
]
```

### 15.3 Verifikation als Build-Step (empfohlen, MUSS bei Seed-Daten)

Da didaktische Korrektheit kritisch ist, soll der Agent eine **automatische Aufgabenprüfung** implementieren.

**Anforderung:**

- Ein Skript `verify-tasks` liest die Seed-JSON ein, parst jede Aufgabenform, rechnet intern mit der Bruch-Engine nach und vergleicht mit `answer`.
- Für MC-Aufgaben zusätzlich prüfen:
  - `answer` ist nicht in `distractors`
  - Distractors sind gekürzt und ≠ 0-Division
- Für Textaufgaben: nur formale Prüfung (Ergebnis stimmt), keine NLP-Validierung.

**CI/Build:**

- `npm test` oder gleichwertig muss `verify-tasks` ausführen.
- Build schlägt fehl, wenn eine Aufgabe nicht verifiziert.

**Zusatz (optional, stark empfohlen):**

- Property-based Tests / Fuzzing für `simplify`, `mul`, `div`, `parseFraction`.

---

## 16. Hinweise zur didaktischen Qualität der Seeds

- Seeds decken jede Kernregel mindestens einmal ab (Mul, Div, Kehrwert, Gemischt, Kürzen, Über-Kreuz).
- Aufgaben sind bewusst so gewählt, dass:
  - Kürzen realen Nutzen zeigt (z.B. 6/7 · 14/15)
  - Division sowohl mechanisch als auch interpretativ vorkommt
  - gemischte Zahlen in realistischen Kontexten vorkommen (Liter/Flaschen)
- Wenn später neue Aufgaben generiert werden, sollen sie dieselben Constraints (14.3) erfüllen.

---

## 17. Difficulty Ramp (Schwierigkeitsprogression)

**Ziel:** Einheitliche, nachvollziehbare Steigerung der Schwierigkeit je Subskill. Der Coding-Agent soll diese Ramps direkt in Generatoren und adaptive Auswahl einbauen.

### 17.1 Allgemeine Prinzipien

- Schwierigkeit wird über **Zahlenraum**, **notwendige Schritte** und **Abstraktionsgrad** gesteuert.
- Ein Level darf **genau eine neue Hürde** einführen.
- Diagnose nutzt überwiegend **Level 1–2**, Training skaliert bis Level 3.

### 17.2 Level-Definitionen

#### Level 1 – Einstieg / Sicherheit

- Nenner ≤ 8
- Keine oder triviale Kürzung
- Maximal ein Rechenschritt (Mul *oder* Div)
- Keine gemischten Zahlen
- Textaufgaben nur mit expliziter Rechenanweisung

**Beispiele:**

- 2/3 · 1/4
- 3/5 ÷ 1/2
- 12/18 kürzen

#### Level 2 – Regelanwendung mit Strategie

- Nenner ≤ 15
- Kürzen sinnvoll, aber nicht zwingend notwendig
- Über-Kreuz-Kürzen möglich
- Gemischte Zahl × Bruch **oder** Bruch ÷ Bruch
- Textaufgaben mit kurzer Interpretation („von“, „aufteilen“)

**Beispiele:**

- 6/7 · 14/15
- 8/9 ÷ 4/15
- 1 1/2 · 2/3

#### Level 3 – Kombination & Transfer

- Nenner ≤ 30
- Mehrere sinnvolle Kürzschritte
- Gemischte Zahl ÷ Bruch oder gemischt ÷ gemischt
- Textaufgaben mit zwei Denkschritten
- „Zahl gesucht“-Aufgaben

**Beispiele:**

- 3 1/4 ÷ 1/2
- □ · 2/3 = 5/6
- Saft-/Flaschen-Aufgabe

### 17.3 Adaptive Steuerung (Soll)

- Start im Training immer **eine Stufe unter der höchsten stabil gemeisterten**
- Aufstieg erst, wenn:
  - ≥ 80 % korrekt auf aktuellem Level
  - ≥ 60 % Selbsteinschätzung „sehr sicher“

---

## 18. Fehlerklassifikation (Error Taxonomy)

**Ziel:** Fehler nicht nur als „falsch“, sondern als **diagnostisch verwertbare Information** behandeln.

### 18.1 Grundprinzip

- Jeder Fehlversuch wird genau **einer primären Fehlerklasse** zugeordnet.
- Fehlerklassen steuern:
  - Sofortfeedback (passende Erklärung)
  - Auswahl der nächsten Trainingsaufgaben

### 18.2 Fehlerklassen (Kanonisch)

#### E\_PARSE – Eingabe / Darstellung

- Gemischte Zahl falsch eingegeben (z.B. „1/2 3“)
- Bruch falsch formatiert

#### E\_MUL\_RULE – Multiplikationsregel

- Zähler/Nenner vertauscht
- Nur einen Zähler/Nenner multipliziert

#### E\_DIV\_INVERT – Kehrwert-Regel

- Kehrwert vergessen
- Falschen Bruch invertiert

#### E\_SIM\_NONE – Nicht gekürzt

- Ergebnis rechnerisch korrekt, aber nicht gekürzt

#### E\_SIM\_WRONG – Falsch gekürzt

- Kürzen mit Nicht-Teiler
- Zähler und Nenner unterschiedlich gekürzt

#### E\_CROSS\_SIM – Über-Kreuz-Kürzen falsch

- Falsches Paar gekürzt
- Kürzen vor Kehrwert bei Division

#### E\_MIX\_CONVERT – Gemischte Zahl umwandeln

- Ganze Zahl nicht mit Nenner multipliziert
- Zähler falsch addiert

#### E\_MISSING\_LOGIC – Zahl-gesucht-Logik

- Falsches Umstellen
- Falsche inverse Operation gewählt

#### E\_WORD\_OP – Textaufgabe falsch interpretiert

- Multiplikation statt Division oder umgekehrt
- Einheit ignoriert

### 18.3 Mapping Fehler → Intervention

| Fehlerklasse    | Intervention                                                       |
| --------------- | ------------------------------------------------------------------ |
| E\_DIV\_INVERT  | Mini-Erklärung „Warum Kehrwert?“ + 1 sehr leichte Divisionsaufgabe |
| E\_SIM\_NONE    | Hinweis „Du kannst kürzen – probier’s“ + Kürz-Jagd                 |
| E\_SIM\_WRONG   | Schrittweises Kürzen mit markierten Teilern                        |
| E\_MIX\_CONVERT | Umwandlungs-Werkstatt (ohne Rechnen)                               |
| E\_WORD\_OP     | Visualisierung + gleiche Aufgabe mit Zahlen ersetzt                |

### 18.4 Logging

`Attempt.errorType` (nullable) speichert Fehlerklasse.

- Statistik pro Subskill: häufigste Fehlerklasse
- Dashboard optional: „Typischer Fehler: Kehrwert vergessen“

---

## 19. Empfehlung für Coding-Agent (wichtig)

- **Zuerst Bruch-Engine + Verifikation bauen**, dann UI.
- Seed-Aufgaben **nie manuell vertrauen**, immer durch `verify-tasks` prüfen.
- Generatoren so bauen, dass sie **Difficulty Ramp + Error Taxonomy** respektieren.

Damit ist das Dokument vollständig genug, um von einem starken Coding-Agent **ohne Rückfragen** umgesetzt zu werden.

---

## 20. Bruch-Engine – vollständige Spezifikation (MUSS)

**Ziel:** Der Coding-Agent soll die Engine implementieren können, ohne Rückfragen zu Datenformat, Parsing, Normalisierung, Kürzen, Vergleich, Darstellung und Auswertung.

### 20.1 Datentypen & Invarianten

- Grundtyp: `Fraction = { num: BigInt, den: BigInt }`
- Invarianten nach jeder Operation/Parse:
  - `den > 0`
  - vollständig gekürzt: `gcd(|num|, den) = 1`
  - Null wird immer als `{ num: 0, den: 1 }` gespeichert

Benötigte Hilfsfunktionen:

- `absBig(n: BigInt) -> BigInt`
- `gcd(a: BigInt, b: BigInt) -> BigInt` (Euklidischer Algorithmus)
- optional: `lcm(a,b)` (für spätere Erweiterungen)

### 20.2 Normalisierung / Kürzen

#### 20.2.1 `normalize(num, den) -> Fraction`

- Wenn `den == 0` ⇒ Fehler `DivisionByZeroDenominator`
- Wenn `den < 0` ⇒ Vorzeichen nach `num` ziehen (`num = -num; den = -den`)
- Wenn `num == 0` ⇒ `{0,1}`
- `g = gcd(abs(num), den)` ⇒ `{ num/g, den/g }`

#### 20.2.2 `simplify(frac) -> Fraction`

- Muss äquivalent zu `normalize(frac.num, frac.den)` sein

### 20.3 Arithmetik (exakt, ohne Floats)

Alle Operationen liefern **normalisierte** Ergebnisse.

#### 20.3.1 Multiplikation

`mul(a,b)`:

- `normalize(a.num*b.num, a.den*b.den)`

Optional (empfohlen): Cross-Cancel zur Performance/Lesbarkeit

- `g1 = gcd(abs(a.num), b.den)`; `g2 = gcd(abs(b.num), a.den)`
- rechne mit gekürzten Zwischenwerten

#### 20.3.2 Division

`div(a,b)`:

- Wenn `b.num == 0` ⇒ Fehler `DivisionByZero`
- `normalize(a.num*b.den, a.den*b.num)`

Hinweis: Die Kehrwert-Regel ist didaktisch; engine-seitig ist obige Formel maßgeblich.

### 20.4 Vergleich

- `equals(a,b)` (bei normalisierten Brüchen): `a.num == b.num && a.den == b.den`
- optional: `compare(a,b)` via Kreuzproduktvergleich

### 20.5 Formatierung (Anzeige)

`formatFraction(frac, mode)`:

- Wenn `den == 1` ⇒ ganze Zahl ausgeben
- Sonst:
  - `mode="improper"`: Ausgabe `"num/den"` (Vorzeichen nur am Zähler)
  - `mode="proper"`: gemischte Zahl, wenn `|num| >= den`: `"whole remainder/den"` mit genau einem Leerzeichen

### 20.6 Parsing (Eingabe von Schüler*in)

#### 20.6.1 Erlaubte Eingaben

- Ganze Zahl: `7`, `-3`
- Bruch: `3/4`, `-3/4` (Whitespace tolerant, z.B. `" 3 / 4 "`)
- Gemischte Zahl: `1 1/2`, `-1 1/2` (auch NBSP zwischen Ganzzahl und Bruchteil tolerant)

#### 20.6.2 Parsing-Regeln (präzise, ohne Regex-Abhängigkeit)

Implementiere `parseFraction(input: string)` mit folgendem Ablauf:

1. Trim und Whitespace normalisieren (mehrere Leerzeichen → ein Leerzeichen; NBSP wie Space behandeln)
2. Wenn das Ergebnis **ein Leerzeichen enthält** und außerdem einen `/`:
   - interpretiere als gemischte Zahl: `whole` + `n/d`
   - Validierung: `whole` ist Integer; `n` und `d` sind positive Integers; `0 < n < d`
   - Umwandlung:
     - `sign = sign(whole)` (bei `whole=0` sign = +1)
     - `num = sign * (abs(whole)*d + n)`
     - `den = d`
3. Sonst wenn es einen `/` enthält:
   - interpretiere als Bruch `num/den` (num kann negativ, den muss positiv sein)
4. Sonst:
   - interpretiere als Integer `num/1`
5. Immer `normalize(num,den)` zurückgeben.

#### 20.6.3 Fehlerfälle

- `den == 0` ⇒ Parse-Fehler
- Mehrdeutige Formate (z.B. `"1/2 3"`) ⇒ Parse-Fehler
- Gemischte Zahl mit nicht-gekürztem Bruchteil (z.B. `"1 2/4"`) ⇒ **didaktisch nicht zulassen** ⇒ Fehler `MixedInvalid` (oder `E_SIM_NONE` nur, wenn ihr explizit eine „Korrigier mich“-UX wollt; Empfehlung: `MixedInvalid`)
- Zeichen außerhalb Ziffern, `-`, `/`, Whitespace ⇒ Parse-Fehler

### 20.7 Evaluator (Korrektheit + „nicht gekürzt“)

#### 20.7.1 Korrektheit

- Parse Nutzerantwort zu normalisiertem `Fraction user`
- Vergleiche mit normalisiertem `Fraction expected`
- korrekt ⇔ `equals(user, expected)`

#### 20.7.2 „Nicht gekürzt“-Erkennung (MUSS)

Da `parseFraction` normalisiert, braucht es für Kürz-Hinweise zusätzlich eine Roh-Analyse:

- `parseFractionRaw(input)` liefert zusätzlich:
  - `rawNum`, `rawDen` (wie eingegeben, nur Whitespace bereinigt)
  - `normalized`
- Wenn `equals(normalized, expected)` **und** `gcd(abs(rawNum), rawDen) > 1` ⇒ `E_SIM_NONE`

Hinweis: Bei ganzen Zahlen (`den=1`) ist das nie `E_SIM_NONE`.

### 20.8 Prozess-Prüfung für Kürz-Modi

Für Kürz-Jagd / Werkstatt braucht die Engine prüfbare Schritte:

- `isDivisible(x,k)`
- `reducePair(x,k)` (nur wenn teilbar)
- optional: `divisors(x)` für kleine x zur UI-Unterstützung

Akzeptanzregel: **Mehrere korrekte Kürzpfade sind erlaubt**; es reicht, wenn jeder Schritt gültig ist und das Endergebnis korrekt normalisiert ist.

### 20.9 Aufgaben-Verifikation (Build-Step) – robust und wartbar

**MUSS:** `verify-tasks` rechnet jede Seed-Aufgabe mit der Engine nach und vergleicht gegen `answer`.

**Empfehlung (v1.1, sehr sinnvoll):** Ergänze jedes Seed-Objekt um ein maschinenlesbares Feld `expr`, damit `verify-tasks` nicht `prompt` parsen muss. Beispiel:

- `{ op: "mul", a: "2/3", b: "3/5" }`
- `{ op: "div", a: "3/4", b: "2/5" }`
- `{ op: "simplify", a: "18/24" }`

Dann ist Verifikation deterministisch und unabhängig vom UI-Text.

---

## 21. Seed-Aufgaben-JSON (v1.1) – optionaler Upgrade-Pfad

Wenn der Agent es direkt sauber machen will:

- erweitere jedes Seed-Objekt um:
  - `expr` (maschinenlesbar)
  - `requiresSimplifiedAnswer: boolean` (für gezieltes Kürztraining)

Das reduziert Komplexität und erhöht die Verifikationssicherheit.

