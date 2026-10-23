# Dev Tracker

This app tracks personal development (things like working out, becoming more disciplined etc.) over time using an XP system to level up.

## Stats

- Discipline
- Business
- Health
- Mind

## How it works

- Each log gives a flat **+10 XP** to the chosen stat. No streaks, no variable XP.
- Each stat has a text box for what you did. A log is blocked until something is typed (whitespace-only doesn't count), and the action is saved with the stat and time.
- Level = `floor(XP / 100)`, calculated per stat and overall (total XP).
- Logs are kept in your browser's `localStorage`. Entries can't be deleted.

## Usage

Open `index.html` in a browser and click a stat's button each time you do something for it.
