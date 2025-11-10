<script>
  import * as Tone from 'tone'
  import { diatonicTriads, chordNotes, guitarShapes, ukeShapes } from './lib/chords'
  import ChordDiagram from './components/ChordDiagram.svelte'
  import ChordButton from './components/ChordButton.svelte'
  import ProgressionBar from './components/ProgressionBar.svelte'
  import { onMount } from 'svelte'

  let key = 'C'
  $: chords = diatonicTriads(key)

  let currentChord = 'C'
  let progression = []
  let bpm = 92
  let defaultBeats = 4
  let showDiagrams = true

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
  let loop = true
  let part
  let isTouch = false
  let currentBeat = -1

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
      Tone.Transport.bpm.value = bpm
      started = true
    }
  }

  onMount(() => {
    // Detect coarse pointer/touch devices
    isTouch = (typeof window !== 'undefined') && (
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
      ('ontouchstart' in window)
    )

    // Proactively unlock audio on first user interaction on mobile
    const handler = async () => {
      try {
        await ensureAudio()
        if (Tone?.Destination?.context?.state === 'suspended') {
          await Tone.Destination.context.resume()
        }
        // Brief, very quiet oscillator to reliably unlock iOS audio
        try {
          const unlockGain = new Tone.Gain(0.0005).toDestination()
          const osc = new Tone.Oscillator(440, 'sine').connect(unlockGain)
          osc.start()
          osc.stop('+0.02')
          // Dispose shortly after to free resources
          setTimeout(() => { osc.dispose(); unlockGain.dispose() }, 100)
        } catch {}
      } catch {}
      window.removeEventListener('pointerdown', handler)
      window.removeEventListener('touchstart', handler)
      window.removeEventListener('touchend', handler)
      window.removeEventListener('click', handler)
    }
    window.addEventListener('pointerdown', handler, { capture: true })
    window.addEventListener('touchstart', handler, { capture: true })
    window.addEventListener('touchend', handler, { capture: true })
    window.addEventListener('click', handler, { capture: true })
  })

  $: if (started) {
    Tone.Transport.bpm.value = bpm
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
    progression = [...progression, { chord, beats: defaultBeats }]
  }

  function addRestToProgression() {
    progression = [...progression, { chord: null, beats: defaultBeats }]
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

  function insertAt(index, chord) {
    const i = Math.max(0, Math.min(index ?? progression.length, progression.length))
    const normalizedChord = chord === 'REST' ? null : chord
    const item = { chord: normalizedChord, beats: defaultBeats }
    progression = [...progression.slice(0, i), item, ...progression.slice(i)]
  }

  // Reactive statement to update the sequence whenever the progression changes
  $: if (progression && started) {
    if (Tone.Transport.state === 'started') {
      updateSequence(true) // restart playback
    }
  }

  // This function builds or rebuilds the Tone.js Part from the progression
  function updateSequence(restart = false) {
    const wasRunning = Tone.Transport.state === 'started'
    if (wasRunning) Tone.Transport.stop()

    Tone.Transport.cancel(0)
    if (part) {
      part.dispose()
      part = null
    }
    
    if (progression.length === 0) {
      currentBeat = -1
      return
    }

    const quarter = Tone.Time('4n').toSeconds()
    const events = []
    let acc = 0
    progression.forEach((item, i) => {
      const notes = item?.chord ? chordNotes(item.chord) : []
      const beats = item?.beats || 4
      item.startBeat = Math.floor(acc / quarter)
      for (let s = 0; s < beats; s++) {
        const dir = 'down'
        events.push({ time: acc + s * quarter, notes, dir, beat: item.startBeat + s, chord: item.chord })
      }
      acc += beats * quarter
    })

    part = new Tone.Part((time, ev) => {
      currentBeat = ev.beat
      if (currentChord !== ev.chord) {
        currentChord = ev.chord
      }
      if (ev.notes && ev.notes.length) {
        strumChord(ev.notes, time, ev.dir)
      }
    }, events).start(0)
    part.loop = loop
    part.loopEnd = acc

    if (restart || wasRunning) {
      Tone.Transport.start('+0.05')
    }
  }

  async function playProgression() {
    await ensureAudio()
    currentBeat = 0
    updateSequence(true)
    Tone.Transport.on('stop', () => { currentBeat = -1 })
  }

  function stopProgression() {
    Tone.Transport.stop()
    Tone.Transport.cancel(0)
    if (part) { part.dispose(); part = null }
    currentBeat = -1
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
        <label class="text-sm text-slate-300" for="bpm-input">BPM</label>
        <input id="bpm-input" type="number" min="30" max="240" step="1" bind:value={bpm} class="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2" />
      </div>
    </header>

    <section class="grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2 space-y-4">
        <h2 class="font-semibold text-slate-200">Chords in {key} major</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {#each chords as c}
            <ChordButton name={c} {isTouch} onPreview={() => preview(c)} onAdd={() => addToProgression(c)} onSelect={() => selectChord(c)} />
          {/each}
          <!-- Rest tile (draggable) -->
          <ChordButton name="Rest" {isTouch} dragPayload="REST" onAdd={addRestToProgression} onSelect={() => selectChord('Rest')} />
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-slate-200">Chord Diagrams: {currentChord}</h2>
          <button class="text-sm px-3 py-1 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700" on:click={() => showDiagrams = !showDiagrams}>
            {showDiagrams ? 'Hide' : 'Show'}
          </button>
        </div>
        {#if showDiagrams}
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-2">
              <div class="text-xs uppercase tracking-wide text-slate-400">Guitar</div>
              <ChordDiagram instrument="guitar" shape={{...guitarShapes[currentChord || 'Rest'], chord: currentChord || 'Rest'}} clickable={true} on:click={() => preview(currentChord)} />
            </div>
            <div class="space-y-2">
              <div class="text-xs uppercase tracking-wide text-slate-400">Ukulele</div>
              <ChordDiagram instrument="uke" shape={{...ukeShapes[currentChord || 'Rest'], chord: currentChord || 'Rest'}} clickable={true} on:click={() => preview(currentChord)} />
            </div>
          </div>
        {/if}
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="font-semibold text-slate-200">Progression</h2>
      <ProgressionBar {progression} {currentBeat} {isTouch} onRemove={removeFromProgression} onUpdateBeat={updateBeats} onReorder={reorderProgression} onInsert={insertAt} />
      <div class="flex flex-wrap items-center gap-3">
        <button class="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold"
          on:click={playProgression}
          on:touchstart|preventDefault={playProgression}>Play progression</button>
        <button class="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-100"
          on:click={stopProgression}
          on:touchstart|preventDefault={stopProgression}>Stop</button>
        <label class="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" bind:checked={loop} class="accent-cyan-500" />
          Loop
        </label>
        <button class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700" on:click={() => { progression = [] }}>Clear</button>
        <div class="flex items-center gap-2 text-sm text-slate-300">
          <label for="default-beats">Default beats</label>
          <input id="default-beats" type="number" min="1" step="1" bind:value={defaultBeats} class="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1" />
        </div>
      </div>
    </section>

    <footer class="pt-8 text-sm text-slate-400">Tip: Click ▶︎ to preview. Click Add to append. Drag chords from the top grid into the progression and drag within the bar to reorder. Use the Rest tile for pauses. Adjust beats per chord with the number field; default beats applies to new items.</footer>
  </div>
</main>
