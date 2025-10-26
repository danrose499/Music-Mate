const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function noteIndex(note) {
  return NOTES_SHARP.indexOf(note)
}

function transpose(note, semitones) {
  const i = noteIndex(note)
  const idx = (i + semitones + 12) % 12
  return NOTES_SHARP[idx]
}

export function majorScale(key) {
  const intervals = [2,2,1,2,2,2,1]
  const root = key
  const notes = [root]
  let current = root
  for (let step of intervals.slice(0,6)) {
    current = transpose(current, step)
    notes.push(current)
  }
  return notes
}

export function diatonicTriads(key) {
  const scale = majorScale(key)
  const qualities = ['','m','m','', '', 'm','dim']
  return scale.map((n, i) => `${n}${qualities[i]}`)
}

export function chordNotes(chord) {
  // Generate basic chord tones (triads)
  // e.g. 'C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'
  const root = chord.replace(/m|dim/g, '')
  const isMinor = /m(?!aj)/.test(chord)
  const isDim = /dim/.test(chord)

  const intervals = isDim ? [0, 3, 6] : isMinor ? [0, 3, 7] : [0, 4, 7]

  const baseOctave = 4
  const rootIdx = noteIndex(root)
  const notes = intervals.map(semi => {
    const n = NOTES_SHARP[(rootIdx + semi) % 12]
    const octave = baseOctave + Math.floor((rootIdx + semi) / 12)
    return `${n}${octave}`
  })

  // Create a 6-note voicing across two octaves for a fuller strum
  const spread = [0, 12, 7, 19, 24, 31] // relative to rootOctave mapping of triad tones
  const triadMidi = intervals.map(semi => rootIdx + semi + baseOctave * 12)
  const voiced = spread.map(s => triadMidi[s % 3] + Math.floor(s / 3) * 12)
  return voiced.map(m => `${NOTES_SHARP[m % 12]}${Math.floor(m/12)}`)
}

// Chord shape set for demo (guitar: EADGBE left->right; uke: GCEA)
// shape: { frets: number[], baseFret: number }
export const guitarShapes = {
  'A': { frets: [-1, 0, 2, 2, 2, 0], baseFret: 1 },
  'Am': { frets: [-1, 0, 2, 2, 1, 0], baseFret: 1 },
  'Adim': { frets: [-1, -1, 1, 2, 1, 2], baseFret: 1 },
  'A#': { frets: [-1, 1, 3, 3, 3, 1], baseFret: 1 },
  'A#m': { frets: [-1, 1, 3, 3, 2, 1], baseFret: 1 },
  'A#dim': { frets: [-1, -1, 2, 3, 2, 3], baseFret: 1 },
  'B': { frets: [-1, 2, 4, 4, 4, 2], baseFret: 1 },
  'Bm': { frets: [-1, 2, 4, 4, 3, 2], baseFret: 1 },
  'Bdim': { frets: [-1, 2, -1, 2, 3, 1], baseFret: 1 },
  'C': { frets: [-1, 3, 2, 0, 1, 0], baseFret: 1 },
  'Cm': { frets: [-1, 1, 3, 3, 2, 1], baseFret: 3 },
  'Cdim': { frets: [-1, -1, 1, 2, 1, 2], baseFret: 1 },
  'C#': { frets: [-1, -1, 3, 1, 2, 1], baseFret: 1 },
  'C#m': { frets: [-1, -1, 2, 1, 2, 0], baseFret: 1 },
  'C#dim': { frets: [-1, -1, 2, 3, 2, 3], baseFret: 1 },
  'D': { frets: [-1, -1, 0, 2, 3, 2], baseFret: 1 },
  'Dm': { frets: [-1, -1, 0, 2, 3, 1], baseFret: 1 },
  'Ddim': { frets: [-1, -1, 0, 1, 0, 1], baseFret: 1 },
  'D#': { frets: [-1, -1, 3, 1, 2, 1], baseFret: 3 },
  'D#m': { frets: [-1, -1, 4, 3, 4, 2], baseFret: 1 },
  'D#dim': { frets: [-1, -1, 1, 2, 1, 2], baseFret: 1 },
  'E': { frets: [0, 2, 2, 1, 0, 0], baseFret: 1 },
  'Em': { frets: [0, 2, 2, 0, 0, 0], baseFret: 1 },
  'Edim': { frets: [-1, -1, 2, 3, 2, 3], baseFret: 1 },
  'F': { frets: [1, 3, 3, 2, 1, 1], baseFret: 1 },
  'Fm': { frets: [1, 3, 3, 1, 1, 1], baseFret: 1 },
  'Fdim': { frets: [-1, -1, 0, 1, 0, 1], baseFret: 1 },
  'F#': { frets: [2, 4, 4, 3, 2, 2], baseFret: 1 },
  'F#m': { frets: [2, 4, 4, 2, 2, 2], baseFret: 1 },
  'F#dim': { frets: [-1, -1, 1, 2, 1, 2], baseFret: 1 },
  'G': { frets: [3, 2, 0, 0, 0, 3], baseFret: 1 },
  'Gm': { frets: [1, 3, 3, 1, 1, 1], baseFret: 3 },
  'Gdim': { frets: [-1, -1, 2, 3, 2, 3], baseFret: 1 },
  'G#': { frets: [1, 3, 3, 2, 1, 1], baseFret: 4 },
  'G#m': { frets: [1, 3, 3, 1, 1, 1], baseFret: 4 },
  'G#dim': { frets: [-1, -1, 0, 1, 0, 1], baseFret: 1 },
}

export const ukeShapes = {
  'A': { frets: [2, 1, 0, 0], baseFret: 1 },
  'Am': { frets: [2, 0, 0, 0], baseFret: 1 },
  'Adim': { frets: [2, 3, 2, 3], baseFret: 1 },
  'A#': { frets: [3, 2, 1, 1], baseFret: 1 },
  'A#m': { frets: [3, 1, 1, 1], baseFret: 1 },
  'A#dim': { frets: [0, 1, 0, 1], baseFret: 1 },
  'B': { frets: [4, 3, 2, 2], baseFret: 1 },
  'Bm': { frets: [4, 2, 2, 2], baseFret: 1 },
  'Bdim': { frets: [2, 3, 2, 3], baseFret: 1 },
  'C': { frets: [0, 0, 0, 3], baseFret: 1 },
  'Cm': { frets: [0, 3, 3, 3], baseFret: 1 },
  'Cdim': { frets: [2, 3, 2, 3], baseFret: 1 },
  'C#': { frets: [1, 1, 1, 4], baseFret: 1 },
  'C#m': { frets: [1, 1, 0, 3], baseFret: 1 },
  'C#dim': { frets: [0, 1, 1, 1], baseFret: 1 },
  'D': { frets: [0, 2, 3, 2], baseFret: 1 },
  'Dm': { frets: [2, 2, 1, 0], baseFret: 1 },
  'Ddim': { frets: [1, 2, 1, 2], baseFret: 1 },
  'D#': { frets: [3, 3, 3, 1], baseFret: 1 },
  'D#m': { frets: [3, 3, 2, 1], baseFret: 1 },
  'D#dim': { frets: [2, 3, 2, 3], baseFret: 1 },
  'E': { frets: [4, 4, 4, 2], baseFret: 1 },
  'Em': { frets: [0, 4, 3, 2], baseFret: 1 },
  'Edim': { frets: [0, 1, 0, 1], baseFret: 1 },
  'F': { frets: [2, 0, 1, 0], baseFret: 1 },
  'Fm': { frets: [1, 0, 1, 3], baseFret: 1 },
  'Fdim': { frets: [1, 2, 1, 2], baseFret: 1 },
  'F#': { frets: [3, 1, 2, 1], baseFret: 1 },
  'F#m': { frets: [2, 1, 2, 0], baseFret: 1 },
  'F#dim': { frets: [2, 3, 2, 3], baseFret: 1 },
  'G': { frets: [0, 2, 3, 2], baseFret: 1 },
  'Gm': { frets: [0, 2, 3, 1], baseFret: 1 },
  'Gdim': { frets: [0, 1, 0, 1], baseFret: 1 },
  'G#': { frets: [3, 1, 2, 1], baseFret: 3 },
  'G#m': { frets: [1, 3, 4, 2], baseFret: 1 },
  'G#dim': { frets: [1, 2, 1, 2], baseFret: 1 },
}
