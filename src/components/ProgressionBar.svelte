<script>
  export let progression = []
  export let onRemove
  export let onUpdateBeat
  export let onReorder

  function handleDragStart(e, i) {
    e.dataTransfer.setData('text/plain', String(i))
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e, to) {
    e.preventDefault()
    const fromStr = e.dataTransfer.getData('text/plain')
    const from = parseInt(fromStr, 10)
    if (!Number.isNaN(from) && from !== to) {
      onReorder?.(from, to)
    }
  }
</script>

<div class="flex flex-wrap items-center gap-3" role="list">
  {#each progression as item, i}
    <div
      class="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg cursor-move"
      draggable="true"
      on:dragstart={(e) => handleDragStart(e, i)}
      on:dragover={handleDragOver}
      on:drop={(e) => handleDrop(e, i)}
      role="listitem"
    >
      <span class="font-semibold min-w-12 text-center">{item?.chord}</span>
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
    </div>
  {/each}
</div>
