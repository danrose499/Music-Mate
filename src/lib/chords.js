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

// Very small chord shape set for demo (guitar: EADGBE left->right; uke: GCEA)
// shape: { frets: number[], baseFret: number }
export const guitarShapes = {
  'C': { frets: [-1, 3, 2, 0, 1, 0], baseFret: 1 },
  'Dm': { frets: [-1, -1, 0, 2, 3, 1], baseFret: 1 },
  'Em': { frets: [0, 2, 2, 0, 0, 0], baseFret: 1 },
  'F': { frets: [1, 3, 3, 2, 1, 1], baseFret: 1 },
  'G': { frets: [3, 2, 0, 0, 0, 3], baseFret: 1 },
  'Am': { frets: [-1, 0, 2, 2, 1, 0], baseFret: 1 },
  'Bdim': { frets: [-1, 2, -1, 2, 3, 1], baseFret: 1 },
}

export const ukeShapes = {
  'C': { frets: [0, 0, 0, 3], baseFret: 1 },
  'Dm': { frets: [2, 2, 1, 0], baseFret: 1 },
  'Em': { frets: [0, 4, 3, 2], baseFret: 1 },
  'F': { frets: [2, 0, 1, 0], baseFret: 1 },
  'G': { frets: [0, 2, 3, 2], baseFret: 1 },
  'Am': { frets: [2, 0, 0, 0], baseFret: 1 },
  'Bdim': { frets: [2, 3, 2, 3], baseFret: 1 },
}
