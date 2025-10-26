<script>
  export let name
  export let onPreview
  export let onAdd
</script>

<button class="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700">
  <span class="font-semibold">{name}</span>
  <div class="flex gap-2">
    <button type="button" class="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-sm" on:click|stopPropagation={() => onPreview?.()}>
      ▶︎
    </button>
    <button type="button" class="px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm" on:click|stopPropagation={() => onAdd?.()}>
      Add
    </button>
  </div>
</button>
