# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run serve      # Dev server at http://localhost:8080 (hot reload)
npm run build      # Production build → dist/
npm run lint       # ESLint check and auto-fix
```

No test runner is configured; testing is manual only.

## Architecture

**What this is:** A Genshin Impact artifact reinforcement simulator. Users upload an artifact screenshot, the backend OCRs it, and the frontend displays probability distributions for reinforcement outcomes.

**Tech stack:** Vue 3 (Options API), Vue CLI 5 / Webpack, Axios, no CSS framework, no Vuex/Pinia.

### Data Flow

1. User uploads artifact image → `ArtifactImport.vue` emits file → `App.vue` calls `scanImageApi` → populates all form fields from OCR result
2. User adjusts parameters (position, stats, level, score method, score range, elixir) in child components → events bubble to `App.vue` state
3. User clicks "Update" in `OutputArea.vue` → `App.vue` calls `getDistributionApi` (returns PNG blob) and `getDataApi` (returns statistics JSON) → results shown in `OutputArea.vue`

### Component Hierarchy

```
App.vue  ← all shared state lives here
├── OverlayLoading.vue   — spinner shown during API calls
├── OverlayInfo.vue      — modal for usage info
├── ArtifactImport.vue   — file picker for screenshot upload
├── ArtifactInfoArea.vue — artifact config: position, main stat, substats, level, reinforce count, Luna tab (600+ lines, largest component)
├── ScoreInfoArea.vue    — score method (ATK%/HP%/EM%) + init/search score sliders
├── ElixirArea.vue       — elixir item toggle and option config
└── OutputArea.vue       — histogram image, percentile table, statistical metrics
```

### API (`src/scripts/api.js`)

All calls go to `https://artifact-simulator-docker.onrender.com/`:

| Function | Method | Path | Purpose |
|---|---|---|---|
| `scanImageApi(formData)` | POST | `/scan-img` | OCR artifact image → form field values |
| `getDistributionApi(body)` | POST | `/get-dist` | Returns histogram as PNG blob |
| `getDataApi(body)` | POST | `/get-data` | Returns stats JSON (percentiles, mean, variance, skewness, kurtosis) |

### Key Domain Concepts

- **Reinforcement count:** Determined by artifact level (0-3→1, 4-7→2, 8-11→3, 12-15→4, 16-19→5, 20→5). Computed automatically from level.
- **Luna I system (ver5.8+):** New artifact mechanic where a 4th substat option is visible before reinforcement ("active option" awaiting activation). `ArtifactInfoArea.vue` has a tab to configure this.
- **Score types:** ATK%, HP%, Elemental Mastery% — affects how substats are weighted. Range 0–65.
- **Elixir:** Optional item modifier, defaults to crit-dmg + crit-rate combination.

### Patterns

- **Options API** throughout (no Composition API `<script setup>`)
- **Props down, events up:** children receive props and emit `update:propName` events; `App.vue` owns all state
- Path alias `@/` maps to `src/` (configured in `jsconfig.json`)
- Scoped CSS in all components; custom Genshin font via `src/assets/font.css`
- Responsive sizing uses `min(calc(X% / 5), YYpx)` pattern
- Japanese used in comments and UI labels throughout
