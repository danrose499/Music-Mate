<script>
  import * as Tone from 'tone'
  import { diatonicTriads, chordNotes, guitarShapes, ukeShapes } from './lib/chords'
  import ChordDiagram from './components/ChordDiagram.svelte'
  import ChordButton from './components/ChordButton.svelte'
  import ProgressionBar from './components/ProgressionBar.svelte'

  let key = 'C'
  $: chords = diatonicTriads(key)

  let currentChord = 'C'
  let progression = []

  // When the key changes, select the first chord by default
  $: if (chords && chords.length) {
    currentChord = chords[0]
  }

  let synth
  let reverb
  let chorus
  let filter
  let tremolo
  let compressor
  let started = false
  let loop = false
  let part

  // Clicking a chord selects it (updates diagrams) without triggering audio
  function selectChord(chord) {
    currentChord = chord
  }

  async function ensureAudio() {
    if (!started) {
      await Tone.start()
      // Single guitar-like chain
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.003, decay: 0.25, sustain: 0.0, release: 1.2 },
        filterEnvelope: { attack: 0.002, decay: 0.15, sustain: 0.0, release: 0.2, baseFrequency: 2400, octaves: -1 }
      })
      filter = new Tone.Filter({ type: 'lowpass', frequency: 2400, Q: 1.2 })
      chorus = new Tone.Chorus({ frequency: 1.2, depth: 0.3, wet: 0.15 }).start()
      reverb = new Tone.Reverb({ decay: 2.4, wet: 0.18 })
      compressor = new Tone.Compressor({ threshold: -18, ratio: 2, attack: 0.003, release: 0.25 })
      synth.chain(filter, chorus, reverb, compressor, Tone.Destination)
      Tone.Transport.bpm.value = 92
      started = true
    }
  }

  function strumChord(notes, time, direction = 'down') {
    const spread = 0.02 // seconds between string hits
    const arr = direction === 'down' ? notes : [...notes].reverse()
    arr.forEach((n, i) => synth.triggerAttackRelease(n, '4n', time + i * spread))
  }

  async function preview(chord) {
    currentChord = chord
    await ensureAudio()
    const notes = chordNotes(chord)
    const now = Tone.now()
    strumChord(notes, now, 'down')
  }

  function addToProgression(chord) {
    currentChord = chord
    progression = [...progression, { chord, beats: 4 }]
  }

  function addRestToProgression() {
    progression = [...progression, { chord: null, beats: 4 }]
  }

  function removeFromProgression(i) {
    progression = progression.filter((_, idx) => idx !== i)
  }

  function updateBeats(i, beats) {
    const b = Math.max(1, Math.floor(beats || 1))
    progression = progression.map((item, idx) => idx === i ? { ...item, beats: b } : item)
  }

  function reorderProgression(from, to) {
    if (from === to) return
    const arr = [...progression]
    const [moved] = arr.splice(from, 1)
    arr.splice(to, 0, moved)
    progression = arr
  }

  

  async function playProgression() {
    await ensureAudio()
    Tone.Transport.stop()
    Tone.Transport.cancel(0)
    if (part) { part.dispose(); part = null }

    const quarter = Tone.Time('4n').toSeconds()
    const events = []
    let acc = 0
    for (let i = 0; i < progression.length; i++) {
      const item = progression[i]
      const notes = item?.chord ? chordNotes(item.chord) : []
      const strums = (item?.beats || 4)
      for (let s = 0; s < strums; s++) {
        const dir = 'down'
        events.push({ time: acc + s * quarter, notes, dir })
      }
      acc += (item?.beats || 4) * quarter
    }

    if (events.length === 0) return

    part = new Tone.Part((time, ev) => {
      if (ev.notes && ev.notes.length) {
        strumChord(ev.notes, time, ev.dir)
      }
    }, events).start(0)
    part.loop = loop
    part.loopEnd = acc

    Tone.Transport.start('+0.05')
  }

  function stopProgression() {
    Tone.Transport.stop()
    Tone.Transport.cancel(0)
    if (part) { part.dispose(); part = null }
  }
</script>

<main class="min-h-screen p-6 md:p-10">
  <div class="max-w-5xl mx-auto space-y-8">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Music Mate</h1>
      <div class="flex items-center gap-3">
        <label class="text-sm text-slate-300" for="key-select">Key</label>
        <select id="key-select" bind:value={key} class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
          {#each ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as k}
            <option value={k}>{k} major</option>
          {/each}
        </select>
      </div>
    </header>

    <section class="grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2 space-y-4">
        <h2 class="font-semibold text-slate-200">Chords in {key} major</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {#each chords as c}
            <ChordButton name={c} onPreview={() => preview(c)} onAdd={() => addToProgression(c)} onSelect={() => selectChord(c)} />
          {/each}
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="font-semibold text-slate-200">Chord Diagrams</h2>
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <div class="text-xs uppercase tracking-wide text-slate-400">Guitar</div>
            <ChordDiagram instrument="guitar" shape={guitarShapes[currentChord]} />
          </div>
          <div class="space-y-2">
            <div class="text-xs uppercase tracking-wide text-slate-400">Ukulele</div>
            <ChordDiagram instrument="uke" shape={ukeShapes[currentChord]} />
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="font-semibold text-slate-200">Progression</h2>
      <ProgressionBar {progression} onRemove={removeFromProgression} onUpdateBeat={updateBeats} onReorder={reorderProgression} />
      <div class="flex flex-wrap items-center gap-3">
        <button class="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold" on:click={playProgression}>Play progression</button>
        <button class="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-100" on:click={stopProgression}>Stop</button>
        <label class="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" bind:checked={loop} class="accent-cyan-500" />
          Loop
        </label>
        <button class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700" on:click={addRestToProgression}>Add rest</button>
        <button class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700" on:click={() => { progression = [] }}>Clear</button>
      </div>
    </section>

    <footer class="pt-8 text-sm text-slate-400">Tip: Click a chord ▶︎ to preview. Click Add to append it to the progression. Each chord defaults to 4 beats.</footer>
  </div>
</main>
