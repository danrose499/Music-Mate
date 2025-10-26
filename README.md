# MusicMate (Svelte)

A modern Svelte + Vite app to explore keys and build/play simple chord progressions with guitar and ukulele diagrams. Audio powered by Tone.js.

## Features
- Choose a key (major) and view diatonic triads
- Click a chord to preview with a gentle strum
- View guitar and ukulele chord diagrams
- Add chords to a 4-slot progression and play a strummed loop

## Tech
- Svelte 4 + Vite 5
- TailwindCSS 3
- Tone.js

## Run locally
1. Install dependencies
```bash
npm install
```
2. Start dev server
```bash
npm run dev
```
3. Open the printed local URL in your browser.

Note: Browsers require a user gesture to start audio. Click any chord preview or the Play button to initialize audio.

## Notes
- Only sharp spellings are currently supported for keys/notes.
- Chord diagrams are included for the basic diatonic chords; other chords fall back to C shapes.
