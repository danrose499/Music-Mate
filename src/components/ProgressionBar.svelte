<script>
  export let progression = []
  export let onRemove
  export let onUpdateBeat
  export let onReorder
  export let onInsert
  export let isTouch = false
  import dragIcon from '../assets/images/drag.png'

  function handleDragStart(e, i) {
    e.dataTransfer.setData('text/plain', String(i))
    e.dataTransfer.effectAllowed = 'move'
    draggingIndex = i
    // custom drag image
    const img = document.createElement('div')
    img.textContent = `${progression[i]?.chord ?? 'Rest'} (${progression[i]?.beats ?? 4}b)`
    img.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      padding: 6px 10px;
      background: #22d3ee;
      color: #0f172a;
      border-radius: 6px;
      font-weight: 700;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.2);
    `
    document.body.appendChild(img)
    e.dataTransfer.setDragImage(img, img.offsetWidth / 2, img.offsetHeight / 2)
    // cleanup after a tick on dragend
    tempDragImage = img
  }

  function handleDragOver(e) {
    e.preventDefault()
    const types = Array.from(e.dataTransfer?.types || [])
    const isChord = types.includes('application/x-chord')
    e.dataTransfer.dropEffect = isChord ? 'copy' : 'move'
  }

  function handleDrop(e, to) {
    e.preventDefault()
    const fromStr = e.dataTransfer.getData('text/plain')
    const from = parseInt(fromStr, 10)
    if (!Number.isNaN(from) && from !== to) {
      onReorder?.(from, to)
    }
    clearDragState()
  }

  // Enhanced DnD state and helpers
  let draggingIndex = null
  let overIndex = null // insertion cursor index in [0..progression.length]
  let overSide = 'left' // 'left'|'right' for visual on items
  let tempDragImage = null
  let ghostChord = null

  function clearDragState() {
    draggingIndex = null
    overIndex = null
    overSide = 'left'
    if (tempDragImage && tempDragImage.parentNode) tempDragImage.parentNode.removeChild(tempDragImage)
    tempDragImage = null
    ghostChord = null
  }

  function onItemDragOver(e, i) {
    handleDragOver(e)
    e.stopPropagation()
    // detect if dragging from chord grid
    const types = Array.from(e.dataTransfer?.types || [])
    const isChord = types.includes('application/x-chord')
    let chord = null
    try { chord = e.dataTransfer?.getData('application/x-chord') || null } catch {}
    ghostChord = isChord ? (chord || ghostChord || 'Chord') : null
    const rect = e.currentTarget.getBoundingClientRect()
    const mid = rect.left + rect.width / 2
    const isRight = e.clientX > mid
    overSide = isRight ? 'right' : 'left'
    overIndex = i + (isRight ? 1 : 0)
  }

  function onListDragOverEndSlot(e) {
    handleDragOver(e)
    // only set end-slot when hovering the container itself (not children)
    if (e.target !== e.currentTarget) return
    const types = Array.from(e.dataTransfer?.types || [])
    const isChord = types.includes('application/x-chord')
    let chord = null
    try { chord = e.dataTransfer?.getData('application/x-chord') || null } catch {}
    ghostChord = isChord ? (chord || ghostChord || 'Chord') : null
    overIndex = progression.length
    overSide = 'right'
  }

  function onEmptyDragOver(e) {
    handleDragOver(e)
    const types = Array.from(e.dataTransfer?.types || [])
    const isChord = types.includes('application/x-chord')
    let chord = null
    try { chord = e.dataTransfer?.getData('application/x-chord') || null } catch {}
    ghostChord = isChord ? (chord || ghostChord || 'Chord') : null
    overIndex = 0
    overSide = 'left'
  }

  function onItemDrop(e, i) {
    e.preventDefault()
    e.stopPropagation()
    // compute insertion index based on side
    const insertIndex = (overIndex != null) ? overIndex : i

    // Prefer chord insertion from grid
    let chord = e.dataTransfer?.getData('application/x-chord')
    if (!chord) {
      const txt = e.dataTransfer?.getData('text/plain') || ''
      if (txt.startsWith('CHORD:')) chord = txt.slice(6)
    }
    if (chord) {
      onInsert?.(insertIndex, chord)
      clearDragState()
      return
    }

    // Otherwise, treat as reorder of existing item
    const fromStr = e.dataTransfer.getData('text/plain')
    const from = parseInt(fromStr, 10)
    if (!Number.isNaN(from)) {
      let to = insertIndex
      if (from < to) to = to - 1
      if (from !== to) onReorder?.(from, to)
    }
    clearDragState()
  }

  function onDragEnd() {
    clearDragState()
  }

  function moveLeft(i) {
    if (i > 0) onReorder?.(i, i - 1)
  }
  function moveRight(i) {
    if (i < progression.length - 1) onReorder?.(i, i + 1)
  }
</script>

<div
  class="flex flex-wrap items-center gap-3"
  role="list"
  on:dragover={!isTouch ? onListDragOverEndSlot : undefined}
  on:drop={!isTouch ? (e) => onItemDrop(e, progression.length) : undefined}
>
  {#each progression as item, i}
    <div
      class="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg relative"
      class:drop-highlight={!isTouch && ((overIndex === i) || (overIndex === i + 1))}
      draggable={!isTouch}
      on:dragstart={!isTouch ? (e) => handleDragStart(e, i) : undefined}
      on:dragover={!isTouch ? (e) => onItemDragOver(e, i) : undefined}
      on:drop={!isTouch ? (e) => onItemDrop(e, i) : undefined}
      on:dragend={!isTouch ? onDragEnd : undefined}
      role="listitem"
    >
      <img src={dragIcon} alt="drag" class="drag-icon w-4 h-4 opacity-70" draggable="false" />
      <span class="font-semibold min-w-12 text-center">{item?.chord ?? 'Rest'}</span>
      <label class="text-xs text-slate-300" for={`beats-${i}`}>beats</label>
      <input
        class="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
        type="number"
        min="1"
        step="1"
        id={`beats-${i}`}
        value={item?.beats ?? 4}
        on:change={(e) => onUpdateBeat?.(i, +e.currentTarget.value)}
      />
      <button class="text-xs text-slate-300 hover:text-red-300 ml-1" on:click={() => onRemove?.(i)}>✕</button>

      {#if isTouch}
        <div class="ml-1 flex items-center gap-1">
          <button class="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600" on:click={() => moveLeft(i)}>←</button>
          <button class="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600" on:click={() => moveRight(i)}>→</button>
        </div>
      {/if}

      {#if !isTouch && overIndex !== null}
        {#if overIndex === i}
          <div class="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-cyan-400 rounded" />
        {/if}
        {#if overIndex === i + 1}
          <div class="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-cyan-400 rounded" />
        {/if}
      {/if}
    </div>
    {#if !isTouch && ghostChord && overIndex === i + 1 && (i + 1) < progression.length}
      <div class="px-3 py-2 rounded-lg bg-cyan-500/30 border border-cyan-400 text-cyan-100 text-sm font-semibold ghost-preview">{ghostChord === 'REST' ? 'Rest' : ghostChord}</div>
    {/if}
  {/each}

  {#if !isTouch && overIndex === progression.length && progression.length > 0}
    <div class="w-0.5 h-6 bg-cyan-400 rounded self-center" />
    {#if ghostChord}
      <div class="px-3 py-2 rounded-lg bg-cyan-500/30 border border-cyan-400 text-cyan-100 text-sm font-semibold ghost-preview">{ghostChord === 'REST' ? 'Rest' : ghostChord}</div>
    {/if}
  {/if}

  {#if progression.length === 0}
    <div
      class="w-full min-h-[60px] flex items-center justify-center border-2 border-dashed border-slate-600/70 rounded-lg bg-slate-800/60 text-slate-300"
      role="list"
      aria-label="Empty progression drop zone"
      on:dragover={!isTouch ? onEmptyDragOver : undefined}
      on:drop={!isTouch ? (e) => onItemDrop(e, 0) : undefined}
    >
      <div class="pointer-events-none select-none text-sm">Drag chords here</div>
      {#if !isTouch && ghostChord}
        <div class="ml-3 px-3 py-2 rounded-lg bg-cyan-500/30 border border-cyan-400 text-cyan-100 text-sm font-semibold ghost-preview">
          {ghostChord === 'REST' ? 'Rest' : ghostChord}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* highlight the item being dragged for subtle feedback */
  [draggable="true"]:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  /* drop target highlight */
  .drop-highlight {
    box-shadow: inset 0 0 0 2px rgba(34, 211, 238, 0.35);
    transition: box-shadow 120ms ease;
  }

  /* ghost preview animation */
  @keyframes ghostIn {
    from { transform: scale(0.96); opacity: 0.6; }
    to { transform: scale(1); opacity: 1; }
  }
  .ghost-preview {
    animation: ghostIn 140ms ease-out both;
  }
</style>

