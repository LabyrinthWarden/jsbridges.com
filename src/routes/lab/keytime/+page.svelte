<script>
  import { onMount } from 'svelte';

  const STORAGE_KEY = 'keytime-lab-data';

  // ---------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------
  let view = $state('home');
  let tracking = $state(false);
  let todayDate = $state(null);
  let lastTimestamp = $state(null); // Date | null
  let entries = $state([]); // {id,date,timestamp(Date),durationMinutes,type,description,tags[]}
  let settings = $state({
    idleEnabled: true,
    idleThresholdMinutes: 30,
    commonTags: ['work', 'personal', 'urgent', 'learning', 'collaboration']
  });

  let promptDescription = $state('');
  let promptActiveTags = $state([]);
  let promptCustomTags = $state('');
  let promptMeta = $state(null);

  let flashMsg = $state(null);
  let nextId = $state(1);
  let now = $state(new Date());
  let hydrated = $state(false);

  let descInputEl = $state(null);
  let flashTimer;
  let importInputEl = $state(null);

  // ---------------------------------------------------------------------
  // DATE / TIME HELPERS
  // ---------------------------------------------------------------------
  function pad(n) { return String(n).padStart(2, '0'); }
  function todayStr(d = new Date()) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
  function formatClock(d) {
    let h = d.getHours(); const m = pad(d.getMinutes()); const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    return `${h}:${m} ${ampm}`;
  }
  function minutesBetween(a, b) { return Math.max(0, Math.round((b.getTime() - a.getTime()) / 60000)); }
  function elapsedText(mins) {
    if (mins < 1) return 'less than a minute ago';
    if (mins === 1) return '1 minute ago';
    if (mins < 60) return `${mins} minutes ago`;
    const h = Math.floor(mins / 60), m = mins % 60;
    return `${h}h ${m}m ago`;
  }
  function hm(mins) { const h = Math.floor(mins / 60), m = mins % 60; return `${h}h ${m}m`; }
  function dayName(dateStr) { return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' }); }
  function last7Days(d = new Date()) {
    const out = [];
    for (let i = 6; i >= 0; i--) { const x = new Date(d); x.setDate(x.getDate() - i); out.push(todayStr(x)); }
    return out;
  }

  // ---------------------------------------------------------------------
  // PERSISTENCE (localStorage — this is a real deployed page, not a preview)
  // ---------------------------------------------------------------------
  function serialize() {
    return {
      tracking, todayDate,
      lastTimestamp: lastTimestamp ? lastTimestamp.toISOString() : null,
      entries: entries.map((e) => ({ ...e, timestamp: e.timestamp.toISOString() })),
      settings, nextId
    };
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      tracking = !!data.tracking;
      todayDate = data.todayDate || null;
      lastTimestamp = data.lastTimestamp ? new Date(data.lastTimestamp) : null;
      entries = (data.entries || []).map((e) => ({ ...e, timestamp: new Date(e.timestamp) }));
      settings = data.settings || settings;
      nextId = data.nextId || entries.length + 1;
    } catch (err) {
      console.warn('KeyTime: failed to load saved data', err);
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize()));
    } catch (err) {
      console.warn('KeyTime: failed to save data', err);
    }
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(serialize(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `keytime-export-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        tracking = !!data.tracking;
        todayDate = data.todayDate || null;
        lastTimestamp = data.lastTimestamp ? new Date(data.lastTimestamp) : null;
        entries = (data.entries || []).map((e) => ({ ...e, timestamp: new Date(e.timestamp) }));
        settings = data.settings || settings;
        nextId = data.nextId || entries.length + 1;
        view = 'home';
        flash('Data imported.');
      } catch (err) {
        flash('Import failed — not a valid KeyTime export.');
      }
    };
    reader.readAsText(file);
  }

  function resetDemoData() {
    if (!confirm('Clear all entries? This cannot be undone (export first if you want to keep it).')) return;
    entries = []; tracking = false; todayDate = null; lastTimestamp = null;
    view = 'home';
    flash('Cleared.');
  }

  // ---------------------------------------------------------------------
  // CORE ACTIONS
  // ---------------------------------------------------------------------
  function toggleDay() {
    if (!tracking) {
      const n = new Date();
      tracking = true;
      todayDate = todayStr(n);
      lastTimestamp = n;
      entries = [...entries, {
        id: nextId++, date: todayStr(n), timestamp: n,
        durationMinutes: 0, type: 'START', description: 'Day started', tags: []
      }];
      view = 'home';
    } else {
      openPrompt(true);
    }
  }

  function openPrompt(isEndOfDay) {
    if (!tracking) { flash('Not tracking — start your day first.'); return; }
    const n = new Date();
    const minutesElapsed = minutesBetween(lastTimestamp, n);
    promptMeta = {
      minutesElapsed,
      lastTimeFormatted: formatClock(lastTimestamp),
      elapsedText: elapsedText(minutesElapsed),
      openedAt: n
    };
    promptDescription = '';
    promptActiveTags = [];
    promptCustomTags = '';
    view = isEndOfDay ? 'endday' : 'prompt';
    queueMicrotask(() => descInputEl?.focus());
  }

  function toggleTag(tag) {
    promptActiveTags = promptActiveTags.includes(tag)
      ? promptActiveTags.filter((t) => t !== tag)
      : [...promptActiveTags, tag];
  }

  function collectTags() {
    const custom = promptCustomTags.split(',').map((t) => t.trim()).filter(Boolean);
    return [...promptActiveTags, ...custom];
  }

  function saveEntry(isEndOfDay) {
    const desc = promptDescription.trim();
    if (!desc) return;
    const meta = promptMeta;
    entries = [...entries, {
      id: nextId++,
      date: todayStr(meta.openedAt),
      timestamp: meta.openedAt,
      durationMinutes: meta.minutesElapsed,
      type: isEndOfDay ? 'END' : 'WORK',
      description: desc,
      tags: collectTags()
    }];
    lastTimestamp = meta.openedAt;

    if (isEndOfDay) {
      tracking = false;
      todayDate = null;
      flash(`Day ended. Logged ${hm(meta.minutesElapsed)}.`);
    } else {
      flash(`Logged: ${desc} (${meta.minutesElapsed} min)`);
    }
    view = 'home';
  }

  function skipEntry(isEndOfDay) {
    if (!isEndOfDay) lastTimestamp = promptMeta.openedAt;
    view = 'home';
  }

  function logBreak() {
    const meta = promptMeta;
    entries = [...entries, {
      id: nextId++, date: todayStr(meta.openedAt), timestamp: meta.openedAt,
      durationMinutes: meta.minutesElapsed, type: 'BREAK', description: 'Break', tags: ['break']
    }];
    lastTimestamp = meta.openedAt;
    flash(`Break logged (${meta.minutesElapsed} min)`);
    view = 'home';
  }

  function flash(msg) {
    flashMsg = msg;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => { flashMsg = null; }, 3500);
  }

  // ---------------------------------------------------------------------
  // SUMMARIES (derived)
  // ---------------------------------------------------------------------
  function computeSummary(list) {
    let totalWork = 0, totalBreak = 0;
    const items = []; const tagCounts = {};
    for (const e of list) {
      if (e.type === 'END' || e.type === 'WORK') { totalWork += e.durationMinutes; items.push({ type: 'WORK', desc: e.description, mins: e.durationMinutes }); }
      else if (e.type === 'BREAK') { totalBreak += e.durationMinutes; items.push({ type: 'BREAK', desc: 'Break', mins: e.durationMinutes }); }
      for (const t of e.tags || []) tagCounts[t] = (tagCounts[t] || 0) + e.durationMinutes;
    }
    return { totalWork, totalBreak, items, tagCounts };
  }

  let todaySummary = $derived.by(() => {
    const today = todayStr();
    const list = entries.filter((e) => e.date === today);
    const summary = computeSummary(list);
    let unlogged = 0;
    if (tracking && lastTimestamp) unlogged = minutesBetween(lastTimestamp, now);
    return { date: today, ...summary, unlogged };
  });

  let weekly = $derived.by(() => {
    const dates = last7Days();
    const dailyData = {}; dates.forEach((d) => (dailyData[d] = { work: 0, brk: 0 }));
    const tagTotals = {};
    for (const e of entries) {
      if (!dailyData[e.date]) continue;
      if (e.type === 'WORK' || e.type === 'END') dailyData[e.date].work += e.durationMinutes;
      else if (e.type === 'BREAK') dailyData[e.date].brk += e.durationMinutes;
      for (const t of e.tags || []) tagTotals[t] = (tagTotals[t] || 0) + e.durationMinutes;
    }
    const days = dates.map((d) => ({ date: d, dayName: dayName(d), ...dailyData[d] }));
    const totalWork = days.reduce((s, d) => s + d.work, 0);
    const totalBreak = days.reduce((s, d) => s + d.brk, 0);
    return { days, totalWork, totalBreak, avgWork: Math.round(totalWork / 7), tagTotals };
  });

  let recentEntries = $derived([...entries].slice(-6).reverse());
  let maxWeeklyWork = $derived(Math.max(1, ...weekly.days.map((d) => d.work)));

  // ---------------------------------------------------------------------
  // LIFECYCLE
  // ---------------------------------------------------------------------
  onMount(() => {
    loadFromStorage();
    hydrated = true;

    const clockTimer = setInterval(() => { now = new Date(); }, 30000);

    function onKeydown(e) {
      if (e.ctrlKey && e.altKey && e.shiftKey && e.key.toLowerCase() === 't') { e.preventDefault(); openPrompt(false); }
      if (e.ctrlKey && e.altKey && e.shiftKey && e.key.toLowerCase() === 'd') { e.preventDefault(); toggleDay(); }
      if (e.key === 'Escape' && (view === 'prompt' || view === 'endday')) skipEntry(view === 'endday');
    }
    window.addEventListener('keydown', onKeydown);

    return () => {
      clearInterval(clockTimer);
      window.removeEventListener('keydown', onKeydown);
      clearTimeout(flashTimer);
    };
  });

  $effect(() => {
    // re-runs whenever any referenced state changes; skipped until initial load completes
    const snapshot = { tracking, todayDate, lastTimestamp, entries, settings, nextId };
    if (!hydrated) return;
    saveToStorage();
  });

  const NAV_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'today', label: "Today's Summary" },
    { id: 'weekly', label: 'Weekly Report' },
    { id: 'settings', label: 'Settings' },
    { id: 'archive', label: 'Archive / Export' },
    { id: 'about', label: 'About' }
  ];
</script>

<svelte:head>
  <title>KeyTime — Lab</title>
  <script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<div class="kt-root min-h-screen">
  <div class="max-w-3xl mx-auto px-6 py-8">
    <header class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-lg font-bold tracking-wide kt-gold-text">KEYTIME</h1>
        <p class="text-xs kt-dim">Key Sessions Only.</p>
      </div>
      <div class="text-xs px-3 py-1.5 rounded-full kt-card">
        {#if tracking}
          📍 Tracking — last log {formatClock(lastTimestamp)}
        {:else}
          ⏸ Not tracking
        {/if}
      </div>
    </header>

    <nav class="flex flex-wrap gap-2 mb-6 text-sm">
      {#each NAV_ITEMS as item}
        <button
          class="kt-nav-btn px-3 py-1.5 rounded-lg"
          class:active={view === item.id}
          onclick={() => (view = item.id)}
        >
          {item.label}
        </button>
      {/each}
      <button class="kt-nav-btn px-3 py-1.5 rounded-lg ml-auto" onclick={() => openPrompt(false)}>
        ⌨ Log Time (Ctrl+Alt+Shift+T)
      </button>
      <button class="kt-nav-btn px-3 py-1.5 rounded-lg" onclick={toggleDay}>
        {tracking ? '🏁 End Day (Ctrl+Alt+Shift+D)' : '▶ Start Day (Ctrl+Alt+Shift+D)'}
      </button>
    </nav>

    <main>
      {#if flashMsg}
        <div class="kt-card px-4 py-2 mb-4 text-sm kt-flash">{flashMsg}</div>
      {/if}

      {#if view === 'home'}
        <div class="kt-card p-6 mb-4">
          <h2 class="text-sm font-semibold tracking-wide uppercase mb-2 kt-gold-text">Status</h2>
          {#if tracking}
            <p class="text-sm kt-dim">
              Day started. Last check-in <strong class="kt-text">{formatClock(lastTimestamp)}</strong>
              ({elapsedText(minutesBetween(lastTimestamp, now))}).
            </p>
          {:else}
            <p class="text-sm kt-dim">Not tracking. Start your day to begin logging key sessions.</p>
          {/if}
          <div class="flex gap-2 mt-4">
            <button class="kt-btn-primary px-4 py-2 rounded-lg text-sm" onclick={toggleDay}>
              {tracking ? 'End Day' : 'Start Day'}
            </button>
            <button class="kt-btn-ghost px-4 py-2 rounded-lg text-sm" disabled={!tracking} onclick={() => openPrompt(false)}>
              Log Time
            </button>
          </div>
        </div>

        <div class="kt-card p-6">
          <h2 class="text-sm font-semibold tracking-wide uppercase mb-3 kt-gold-text">Recent Activity</h2>
          {#if recentEntries.length === 0}
            <p class="text-sm kt-dim">Nothing logged yet.</p>
          {:else}
            {#each recentEntries as e}
              <div class="flex justify-between text-sm py-1.5 kt-row">
                <span>
                  {e.type === 'BREAK' ? '☕' : e.type === 'START' ? '▶' : e.type === 'END' ? '🏁' : '•'}
                  {e.description}
                </span>
                <span class="kt-dim">
                  {e.type === 'START' || e.type === 'END' ? formatClock(e.timestamp) : `${e.durationMinutes} min`}
                </span>
              </div>
            {/each}
          {/if}
        </div>

      {:else if view === 'prompt' || view === 'endday'}
        {@const isEndOfDay = view === 'endday'}
        <div class="kt-card p-6 max-w-lg mx-auto">
          <h2 class="text-sm font-semibold tracking-wide uppercase mb-1 kt-gold-text">
            {isEndOfDay ? 'KeyTime — End Day' : 'KeyTime'}
          </h2>
          <p class="text-xs mb-4 kt-dim">
            Last check-in: {promptMeta.lastTimeFormatted} ({promptMeta.elapsedText})
            {#if isEndOfDay}<br />🏁 End of day — final entry{/if}
          </p>

          <label class="text-xs block mb-1 kt-dim" for="desc-input">What have you been doing?</label>
          <textarea
            id="desc-input"
            bind:this={descInputEl}
            bind:value={promptDescription}
            rows="3"
            class="kt-field w-full px-3 py-2 text-sm mb-4"
            placeholder="Wrote the KeyTime rebuild plan..."
          ></textarea>

          <span class="text-xs block mb-1 kt-dim">Tags</span>
          <div class="flex flex-wrap gap-2 mb-4">
            {#each settings.commonTags as tag}
              <button
                type="button"
                class="kt-tag-chip px-3 py-1 text-xs"
                class:active={promptActiveTags.includes(tag)}
                onclick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            {/each}
          </div>

          <label class="text-xs block mb-1 kt-dim" for="custom-tags-input">Custom tags (comma-separated)</label>
          <input
            id="custom-tags-input"
            type="text"
            bind:value={promptCustomTags}
            class="kt-field w-full px-3 py-2 text-sm mb-5"
            placeholder="deep-work, client-x"
          />

          <div class="flex gap-2">
            <button class="kt-btn-primary px-4 py-2 rounded-lg text-sm" disabled={!promptDescription.trim()} onclick={() => saveEntry(isEndOfDay)}>
              {isEndOfDay ? 'End Day' : 'Save'}
            </button>
            <button class="kt-btn-ghost px-4 py-2 rounded-lg text-sm" onclick={() => skipEntry(isEndOfDay)}>
              {isEndOfDay ? 'Cancel' : 'Skip'}
            </button>
            {#if !isEndOfDay}
              <button class="kt-btn-ghost px-4 py-2 rounded-lg text-sm" onclick={logBreak}>Log Break</button>
            {/if}
          </div>
        </div>

      {:else if view === 'today'}
        <div class="kt-card p-6">
          <h2 class="text-sm font-semibold tracking-wide uppercase mb-2 kt-gold-text">Today's Summary</h2>
          <p class="text-sm mb-4 kt-dim">
            ⏱️ Work: {hm(todaySummary.totalWork)} &nbsp;·&nbsp; ☕ Breaks: {hm(todaySummary.totalBreak)}
            {#if todaySummary.unlogged}<br />⏳ Current session: {todaySummary.unlogged} min (unlogged){/if}
          </p>
          {#if todaySummary.items.length === 0}
            <p class="text-sm kt-dim">No entries yet.</p>
          {:else}
            {#each todaySummary.items as i}
              <div class="flex justify-between text-sm py-1.5 kt-row">
                <span>{i.type === 'BREAK' ? '☕' : '•'} {i.desc}</span>
                <span class="kt-dim">{i.mins} min</span>
              </div>
            {/each}
          {/if}
          {#if Object.keys(todaySummary.tagCounts).length > 0}
            <h3 class="text-xs font-semibold uppercase mt-4 mb-2 kt-dim">Time by Tag</h3>
            {#each Object.entries(todaySummary.tagCounts) as [tag, mins]}
              <div class="flex justify-between text-sm py-1 kt-row"><span>{tag}</span><span class="kt-dim">{hm(mins)}</span></div>
            {/each}
          {/if}
        </div>

      {:else if view === 'weekly'}
        <div class="kt-card p-6">
          <h2 class="text-sm font-semibold tracking-wide uppercase mb-4 kt-gold-text">Weekly Report</h2>
          {#each weekly.days as d}
            <div class="flex items-center text-sm py-1.5 kt-row gap-3">
              <span class="w-16 shrink-0">{d.dayName} {d.date.slice(5)}</span>
              <div class="kt-bar-track h-2 flex-1"><div class="kt-bar-fill h-full" style="width:{(d.work / maxWeeklyWork) * 100}%"></div></div>
              <span class="w-14 text-right shrink-0 kt-dim">{d.work > 0 ? hm(d.work) : '—'}</span>
            </div>
          {/each}
          <div class="flex justify-between text-sm pt-3 mt-2 kt-total-row">
            <span>Total work</span><span class="kt-dim">{hm(weekly.totalWork)}</span>
          </div>
          <div class="flex justify-between text-sm py-1"><span>Total breaks</span><span class="kt-dim">{hm(weekly.totalBreak)}</span></div>
          <div class="flex justify-between text-sm py-1"><span>Daily average</span><span class="kt-dim">{hm(weekly.avgWork)}</span></div>
          {#if Object.keys(weekly.tagTotals).length > 0}
            <h3 class="text-xs font-semibold uppercase mt-4 mb-2 kt-dim">Time by Tag</h3>
            {#each Object.entries(weekly.tagTotals) as [tag, mins]}
              <div class="flex justify-between text-sm py-1 kt-row"><span>{tag}</span><span class="kt-dim">{hm(mins)}</span></div>
            {/each}
          {/if}
        </div>

      {:else if view === 'settings'}
        <div class="kt-card p-6 max-w-lg">
          <h2 class="text-sm font-semibold tracking-wide uppercase mb-4 kt-gold-text">Settings</h2>

          <label class="flex items-center gap-2 text-sm mb-4">
            <input type="checkbox" bind:checked={settings.idleEnabled} />
            Enable idle reminders
          </label>

          <label class="text-xs block mb-1 kt-dim" for="idle-threshold-input">Remind after (minutes without logging)</label>
          <input id="idle-threshold-input" type="number" min="1" bind:value={settings.idleThresholdMinutes} class="kt-field w-full px-3 py-2 text-sm mb-4" />

          <label class="text-xs block mb-1 kt-dim" for="tags-input">Common tags (comma-separated)</label>
          <input
            id="tags-input"
            type="text"
            value={settings.commonTags.join(', ')}
            onchange={(e) => (settings.commonTags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
            class="kt-field w-full px-3 py-2 text-sm mb-2"
          />
          <p class="text-xs kt-dim">Settings save automatically.</p>
        </div>

      {:else if view === 'archive'}
        <div class="kt-card p-6 max-w-lg">
          <h2 class="text-sm font-semibold tracking-wide uppercase mb-2 kt-gold-text">Archive / Export</h2>
          <p class="text-sm mb-4 kt-dim">
            Data saves automatically to this browser (localStorage). Export gives you a portable
            backup, or a way to move data to another browser/device.
          </p>
          <div class="flex flex-wrap gap-2 mb-4">
            <button class="kt-btn-ghost px-4 py-2 rounded-lg text-sm" onclick={exportData}>⬇ Export as JSON</button>
            <label class="kt-btn-ghost px-4 py-2 rounded-lg text-sm cursor-pointer">
              ⬆ Import JSON
              <input
                bind:this={importInputEl}
                type="file"
                accept="application/json"
                class="hidden"
                onchange={(e) => e.target.files[0] && importData(e.target.files[0])}
              />
            </label>
          </div>
          <button class="text-sm underline kt-dim" onclick={resetDemoData}>Clear all data</button>
        </div>

      {:else if view === 'about'}
        <div class="kt-card p-6 max-w-lg text-center mx-auto">
          <h2 class="text-xl font-bold kt-gold-text">KeyTime</h2>
          <p class="text-sm mt-1 kt-dim">Lab prototype — jsbridges.com/lab/keytime</p>
          <p class="text-sm font-semibold mt-4">Key Sessions Only.</p>
          <div class="text-left mt-6 text-sm">
            <div class="flex justify-between py-1.5 kt-row"><span class="kt-dim">Ctrl+Alt+Shift+D</span><span>Start/End Day</span></div>
            <div class="flex justify-between py-1.5 kt-row"><span class="kt-dim">Ctrl+Alt+Shift+T</span><span>Log Time</span></div>
          </div>
        </div>
      {/if}
    </main>

    <p class="text-xs mt-10 text-center kt-dim">
      Lab prototype — data saves to this browser only. Use Export/Import (under Archive) to move it elsewhere.
    </p>
  </div>
</div>

<style>
  .kt-root {
    /* Muted brass accent — chosen to read like the color of an actual key.
       Kept as the only warm note in the palette; every neutral below is
       genuinely cool/gray so the accent doesn't get diluted into a
       warm-on-warm (retro) feel. */
    --key-gold: oklch(65% 0.08 75);
    --key-gold-soft: oklch(65% 0.08 75 / 0.14);
    --key-gold-dim: oklch(65% 0.08 75 / 0.55);
    --bg: oklch(15% 0.006 250);
    --bg-raised: oklch(24% 0.006 250);
    --bg-card: oklch(20% 0.006 250);
    --border: oklch(30% 0.008 250);
    --text: oklch(95% 0.004 250);
    --text-dim: oklch(62% 0.006 250);

    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, 'Segoe UI', Inter, system-ui, sans-serif;
  }

  .kt-gold-text { color: var(--key-gold); }
  .kt-dim { color: var(--text-dim); }
  .kt-text { color: var(--text); }

  .kt-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .kt-flash { border-color: var(--key-gold); }

  .kt-field {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
  }
  .kt-field:focus { outline: none; border-color: var(--key-gold); }

  .kt-tag-chip {
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--text-dim);
    background: transparent;
    transition: all 0.12s ease;
  }
  .kt-tag-chip.active {
    background: var(--key-gold-soft);
    border-color: var(--key-gold);
    color: var(--key-gold);
  }

  .kt-btn-primary {
    background: var(--key-gold);
    color: oklch(15% 0.01 75);
    font-weight: 600;
  }
  .kt-btn-primary:hover { filter: brightness(1.08); }
  .kt-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; filter: none; }

  .kt-btn-ghost {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    color: var(--text);
  }
  .kt-btn-ghost:hover { border-color: var(--key-gold-dim); }
  .kt-btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

  .kt-nav-btn {
    color: var(--text-dim);
    border: 1px solid transparent;
  }
  .kt-nav-btn:hover { color: var(--text); border-color: var(--border); }
  .kt-nav-btn.active { color: var(--key-gold); border-color: var(--key-gold); background: var(--key-gold-soft); }

  .kt-bar-track { background: var(--bg-raised); border-radius: 4px; overflow: hidden; }
  .kt-bar-fill { background: var(--key-gold); }

  .kt-row { border-bottom: 1px solid var(--border); }
  .kt-row:last-child { border-bottom: none; }
  .kt-total-row { border-top: 1px solid var(--border); }
</style>