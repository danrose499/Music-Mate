<script>
  export let instrument = 'guitar' // 'guitar' or 'uke'
  export let shape = { frets: [], baseFret: 1 }
  export let isActive = false
  export let showFretNumbers = true
  export let clickable = false
  
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  
  const stringCount = instrument === 'uke' ? 4 : 6
  const fretCount = 5

  $: frets = shape?.frets || Array(stringCount).fill(0)
  $: baseFret = shape?.baseFret || 1
  $: chordName = shape?.chord || ''

  const width = 180
  const height = 200
  const padding = 16
  const gridW = width - padding * 2
  const gridH = height - padding * 2 - 24 // Extra space for chord name
  const stepX = gridW / (stringCount - 1)
  const stepY = gridH / fretCount
  
  function handleClick() {
    if (clickable) {
      dispatch('click')
    }
  }
  
  function getFretPosition(fret) {
    if (fret <= 0) return -6 // For open strings and muted strings
    return (fret - (baseFret - 1)) * stepY - stepY/2
  }
</script>

{#if clickable}
  <button 
    class="relative group rounded-lg bg-slate-800 p-2 transition-all duration-300 w-full text-left" 
    class:ring-2={isActive}
    class:ring-cyan-400={isActive}
    class:shadow-lg={isActive}
    on:click={handleClick}
    on:keydown={(e) => e.key === 'Enter' && handleClick()}
    aria-label={`${chordName} chord diagram`}
  >
    <div class="text-center text-sm font-semibold text-slate-200 mb-1">{chordName}</div>
    <div class="relative">
      <svg {width} {height} viewBox={`0 0 ${width} ${height}`} class="block mx-auto">
        <g transform={`translate(${padding}, ${padding + 20})`}>
      <!-- Fret lines -->
      {#each Array(fretCount + 1) as _, i}
        <line 
          x1="0" 
          y1={i*stepY} 
          x2={gridW} 
          y2={i*stepY} 
          stroke={i === 0 ? "#475569" : "#334155"} 
          stroke-width={i === 0 ? 3 : 2} 
          stroke-linecap="round"
        />
      {/each}
      
      <!-- String lines -->
      {#each Array(stringCount) as _, s}
        <line 
          x1={s*stepX} 
          y1="0" 
          x2={s*stepX} 
          y2={gridH} 
          stroke="#334155" 
          stroke-width={s === 0 ? 3 : 2}
          stroke-linecap="round"
        />
      {/each}

      <!-- Fret markers (dots on the side) -->
      {#if showFretNumbers && baseFret > 1}
        <rect x="-14" y={stepY - 6} width="12" height="12" rx="2" class="fill-slate-600" />
        <text x="-20" y={stepY + 4} text-anchor="end" class="fill-slate-300" font-size="12">{baseFret}fr</text>
      {/if}
      
      <!-- Fret position markers (dots on the fingerboard) -->
      {#if [3, 5, 7, 9, 12, 15, 17, 19, 21].includes(baseFret + fretCount - 1)}
        {#each [3, 5, 7, 9, 12, 15, 17, 19, 21].filter(f => f >= baseFret && f < baseFret + fretCount) as fret}
          <circle 
            cx={gridW / 2} 
            cy={(fret - baseFret + 0.5) * stepY} 
            r="3" 
            class="fill-slate-600"
          />
        {/each}
      {/if}

      <!-- Chord finger positions -->
      {#each frets as f, s}
        {#if f === -1}
          <!-- Muted string -->
          <g class="opacity-90">
            <line 
              x1={s*stepX - 4} 
              y1="-8" 
              x2={s*stepX + 4} 
              y2="-12" 
              stroke="#ef4444" 
              stroke-width="2"
            />
            <line 
              x1={s*stepX - 4} 
              y1="-12" 
              x2={s*stepX + 4} 
              y2="-8" 
              stroke="#ef4444" 
              stroke-width="2"
            />
          </g>
        {:else if f === 0}
          <!-- Open string indicator -->
          <circle 
            cx={s*stepX} 
            cy="-6" 
            r="4" 
            class="fill-slate-300"
          />
        {:else}
          <!-- Fingered note -->
          <g class="transition-transform duration-200 hover:scale-110">
            <circle 
              cx={s*stepX} 
              cy={getFretPosition(f)} 
              r="8" 
              class="fill-cyan-400 shadow-md"
              class:animate-pulse={isActive}
            />
          </g>
        {/if}
      {/each}
        </g>
      </svg>
    </div>
  </button>
{:else}
  <div 
    class="relative group rounded-lg bg-slate-800 p-2 transition-all duration-300"
    class:ring-2={isActive}
    class:ring-cyan-400={isActive}
    class:shadow-lg={isActive}
  >
    <div class="text-center text-sm font-semibold text-slate-200 mb-1">{chordName}</div>
    <div class="relative">
      <svg {width} {height} viewBox={`0 0 ${width} ${height}`} class="block mx-auto">
        <g transform={`translate(${padding}, ${padding + 20})`}>
          <!-- Fret lines -->
          {#each Array(fretCount + 1) as _, i}
            <line 
              x1="0" 
              y1={i*stepY} 
              x2={gridW} 
              y2={i*stepY} 
              stroke={i === 0 ? "#475569" : "#334155"} 
              stroke-width={i === 0 ? 3 : 2} 
              stroke-linecap="round"
            />
          {/each}
          
          <!-- String lines -->
          {#each Array(stringCount) as _, s}
            <line 
              x1={s*stepX} 
              y1="0" 
              x2={s*stepX} 
              y2={gridH} 
              stroke="#334155" 
              stroke-width={s === 0 ? 3 : 2}
              stroke-linecap="round"
            />
          {/each}

          <!-- Fret markers (dots on the side) -->
          {#if showFretNumbers && baseFret > 1}
            <rect x="-14" y={stepY - 6} width="12" height="12" rx="2" class="fill-slate-600" />
            <text x="-20" y={stepY + 4} text-anchor="end" class="fill-slate-300" font-size="12">{baseFret}fr</text>
          {/if}
          
          <!-- Fret position markers (dots on the fingerboard) -->
          {#if [3, 5, 7, 9, 12, 15, 17, 19, 21].includes(baseFret + fretCount - 1)}
            {#each [3, 5, 7, 9, 12, 15, 17, 19, 21].filter(f => f >= baseFret && f < baseFret + fretCount) as fret}
              <circle 
                cx={gridW / 2} 
                cy={(fret - baseFret + 0.5) * stepY} 
                r="3" 
                class="fill-slate-600"
              />
            {/each}
          {/if}

          <!-- Chord finger positions -->
          {#each frets as f, s}
            {#if f === -1}
              <!-- Muted string -->
              <g class="opacity-90">
                <line 
                  x1={s*stepX - 4} 
                  y1="-8" 
                  x2={s*stepX + 4} 
                  y2="-12" 
                  stroke="#ef4444" 
                  stroke-width="2"
                />
                <line 
                  x1={s*stepX - 4} 
                  y1="-12" 
                  x2={s*stepX + 4} 
                  y2="-8" 
                  stroke="#ef4444" 
                  stroke-width="2"
                />
              </g>
            {:else if f === 0}
              <!-- Open string indicator -->
              <circle 
                cx={s*stepX} 
                cy="-6" 
                r="4" 
                class="fill-slate-300"
              />
            {:else}
              <!-- Fingered note -->
              <g class="transition-transform duration-200 hover:scale-110">
                <circle 
                  cx={s*stepX} 
                  cy={getFretPosition(f)} 
                  r="8" 
                  class="fill-cyan-400 shadow-md"
                  class:animate-pulse={isActive}
                />
              </g>
            {/if}
          {/each}
        </g>
      </svg>
    </div>
  </div>
{/if}

<style>
  svg { 
    width: 100%; 
    height: auto; 
    user-select: none;
  }
  
  .animate-pulse {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.4; }
  }
</style>
