# Music Mate

Live: https://danrose499.github.io/Music-Mate/

![App Page](src/assets/images/Screenshot.png?raw=true "App Page")

Music Mate is a lightweight Svelte app for exploring keys, previewing chord voicings, and building simple strummed progressions with smooth drag-and-drop.

## Features
- Diatonic triads per key (major) with quick preview
- Guitar and ukulele chord diagrams
- Progression builder with per-item beat counts and global default beats
- Play/stop with a gentle strum engine and optional looping (Tone.js)
- Drag-and-drop UX
  - Drag chords from the top grid into the progression
  - Drag within the progression to reorder
  - Visual insert indicators and ghost previews
  - Dedicated Rest tile (draggable) for pauses

## Tech
- Svelte 4 + Vite 5
- Tailwind CSS 3
- Tone.js

## Development
1) Install dependencies
```bash
npm install
```
2) Start dev server
```bash
npm run dev
```
3) Open the printed local URL in your browser.
