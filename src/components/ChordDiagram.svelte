<script>
  export let instrument = 'guitar' // 'guitar' or 'uke'
  export let shape = { frets: [], baseFret: 1 }

  const stringCount = instrument === 'uke' ? 4 : 6
  const fretCount = 5

  $: frets = shape?.frets || Array(stringCount).fill(0)
  $: baseFret = shape?.baseFret || 1

  const width = 140
  const height = 160
  const padding = 16
  const gridW = width - padding * 2
  const gridH = height - padding * 2
  const stepX = gridW / (stringCount - 1)
  const stepY = gridH / fretCount
</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`} class="rounded-md bg-slate-800">
  <g transform={`translate(${padding}, ${padding})`}>
    {#each Array(fretCount + 1) as _, i}
      <line x1="0" y1={i*stepY} x2={gridW} y2={i*stepY} stroke="#334155" stroke-width={i===0 && baseFret===1 ? 4 : 2} />
    {/each}
    {#each Array(stringCount) as _, s}
      <line x1={s*stepX} y1="0" x2={s*stepX} y2={gridH} stroke="#334155" stroke-width="2" />
    {/each}

    <!-- fret markers -->
    {#each frets as f, s}
      {#if f === -1}
        <text x={s*stepX} y={-4} text-anchor="middle" class="fill-slate-300" font-size="12">x</text>
      {:else if f === 0}
        <circle cx={s*stepX} cy={-6} r="4" class="fill-slate-300" />
      {:else}
        <circle cx={s*stepX} cy={(f - (baseFret - 1)) * stepY - stepY/2} r="7" class="fill-cyan-300" />
      {/if}
    {/each}

    {#if baseFret > 1}
      <rect x="-14" y={stepY - 6} width="12" height="12" rx="2" class="fill-slate-600" />
      <text x="-20" y={stepY + 4} text-anchor="end" class="fill-slate-300" font-size="12">{baseFret}fr</text>
    {/if}
  </g>
</svg>

<style>
  svg { width: 100%; height: auto; }
</style>
