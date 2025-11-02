<script>
  export let name
  export let onPreview
  export let onAdd
  export let onSelect
  export let dragPayload = null

  let tempDragImage = null
  import dragIcon from '../assets/images/drag.png'

  function handleDragStart(e) {
    const payload = dragPayload ?? name
    e.dataTransfer.setData('application/x-chord', payload)
    // Fallback for browsers that strip custom types during dragover/drag
    e.dataTransfer.setData('text/plain', `CHORD:${payload}`)
    e.dataTransfer.effectAllowed = 'copyMove'
    const img = document.createElement('div')
    img.textContent = name
    img.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      padding: 6px 10px;
      background: #22d3ee;
      color: #0f172a;
      border-radius: 6px;
      font-weight: 700;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.2);
    `
    document.body.appendChild(img)
    e.dataTransfer.setDragImage(img, img.offsetWidth / 2, img.offsetHeight / 2)
    tempDragImage = img
  }

  function handleDragEnd() {
    if (tempDragImage && tempDragImage.parentNode) tempDragImage.parentNode.removeChild(tempDragImage)
    tempDragImage = null
  }
</script>

<button
  class="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700"
  on:click={() => onSelect?.()}
  draggable="true"
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
>
  <div class="flex items-center gap-2">
    <img src={dragIcon} alt="drag" class="w-4 h-4 opacity-70" draggable="false" />
    <span class="font-semibold">{name}</span>
  </div>
  <div class="flex gap-2">
    <button type="button" class="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-sm" on:click|stopPropagation={() => onPreview?.()}>
      ▶︎
    </button>
    <button type="button" class="px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm" on:click|stopPropagation={() => onAdd?.()}>
      Add
    </button>
  </div>
</button>
