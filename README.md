# HR Integration Dashboard (React + Vite)

A high-performance, single-page HR Integration Monitoring Dashboard built with React and Vite. It visualizes interface execution trends, status distribution, and a large, filterable log table with pagination.

- Live App: https://hr-dashboard-rust-tau.vercel.app/
- Repository: https://github.com/AbhayKumar2611/HR-Dashboard

## Tech Stack

- React 18
- Vite 5 (development/build tooling)
- Recharts (charts)
- lucide-react (icons)
- ESLint (linting)

## Requirements

- Node.js 18+ (tested on Node v20.11)
- npm 9+

Note: The project is configured to use Vite 5 for compatibility with Node v20.11. If you upgrade Node to >=20.19, you can also move to newer Vite versions.

## Getting Started

```bash
# 1) Clone
git clone https://github.com/AbhayKumar2611/HR-Dashboard
cd HR-Dashboard

# 2) Install dependencies
npm install

# 3) Run dev server
npm run dev
# Vite will print a local URL (usually http://localhost:5173)

# 4) Build for production
npm run build

# 5) Preview production build locally
npm run preview
```

If you are working inside a larger repo with a `dashboard/` subfolder, run the above commands from within that folder.

## Scripts

- `npm run dev`: Start Vite dev server with HMR
- `npm run build`: Build production assets
- `npm run preview`: Preview the production build
- `npm run lint`: Lint the codebase

## Project Structure

```
.
├─ index.html
├─ package.json
├─ vite.config.js
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ App.css
│  ├─ index.css
│  └─ components/
│     └─ InterfaceMonitoringDashboard.jsx
└─ public/
   └─ vite.svg
```

## Features

- Metrics cards (totals, success rate, success/failed/warning counts)
- Line chart of execution trends over time
- Pie chart of status distribution
- Powerful filtering: time range, search, status, interface
- Optional advanced filters (UI scaffolded)
- Large dataset pagination (50 per page by default)
- Responsive layout without Tailwind

## Installing Chart and Icon Libraries

The project uses Recharts and lucide-react. If missing, install with:

```bash
npm install recharts lucide-react
```

---

## Code Walkthrough (InterfaceMonitoringDashboard.jsx)

File: `src/components/InterfaceMonitoringDashboard.jsx` (about 1000 lines)

The component renders the entire dashboard UI and manages data generation, filtering, metrics, charts, and pagination.

### Imports (L1–L3)
- React hooks: `useState`, `useEffect`, `useMemo`
- Recharts primitives: `LineChart`, `PieChart`, `ResponsiveContainer`, etc.
- Icons from `lucide-react`: `Search`, `Filter`, `Calendar`, `Clock`, `AlertCircle`, `CheckCircle`, `XCircle`, `Activity`, `TrendingUp`, `Database`, `Users`, `Zap` (not all are used everywhere).

### Styles (L5–L551)
- A large CSS string named `styles` injected into a `<style>` tag.
- Defines the full look-and-feel: layout, cards, filters, table, responsive breakpoints.

### Mock Data Generator (L553–L600)
- `generateMockData()` creates 100,000 synthetic log records with:
  - `interfaceName` drawn from a predefined list
  - `status` in {SUCCESS, FAILED, WARNING, PENDING}
  - `message` from a set of sample messages
  - `timestamp` randomized within the past 30 days
  - `duration` and `recordsProcessed` randomized
- Returns data sorted by timestamp descending.

Tip: For extremely large data, consider virtualization in the table (e.g., `react-window`) to improve rendering performance.

### Component State (L601–L612)
- `data`: initial data from `generateMockData()`
- `filteredData`: derived array after applying all filters
- Filters: `timeRange`, `searchTerm`, `statusFilter`, `interfaceFilter`, and `customDateRange`
- Pagination: `currentPage`, with `recordsPerPage = 50`

### Filtering Effect (L613–L656)
- Runs when data or filters change
- Time window filter (`1h`, `24h`, `7d`, `30d`, or `custom` range)
- Search filter over `interfaceName`, `integrationKey`, `message`
- Status filter and interface filter
- Resets to page 1 after filtering

### Metrics (useMemo) (L658–L669)
- Aggregates counts of SUCCESS/FAILED/WARNING/PENDING
- Computes `successRate` as a percentage of total

### Chart Data (useMemo) (L671–L684)
- Buckets `filteredData` by day: `{date, SUCCESS, FAILED, WARNING, PENDING}`
- Sorted chronologically for the line chart

### Pie Data (L686–L691)
- Simple array for Recharts `<Pie>` with consistent colors

### Helpers (L693–L707)
- `getStatusIcon(status)`: returns an icon component with a status-specific class
- `getStatusBadge(status)`: returns a badge class name string

### Pagination (L708–L716)
- `totalPages` computed from `filteredData`
- `paginatedData` sliced per page
- `uniqueInterfaces` derived from `data`

### Render (L717–L1025)
- `<style>{styles}</style>` injects the CSS
- Header with title and time-range selector (`select` + optional custom date inputs)
- Metrics cards: totals, success rate, and per-status counts
- Charts grid:
  - Line chart with SUCCESS/FAILED/WARNING series
  - Pie chart for status distribution
- Filters:
  - Search input
  - Status and Interface dropdowns (populated from `uniqueInterfaces`)
  - "Advanced Filters" toggle reveals additional filter inputs (UI only)
- Table of logs with status icon/badge, interface name, key, message, timestamp, duration
- Pagination controls (Previous/Next)

### Important Detail: Reserved Word Fix
If you see a lint/build error like:

```
Identifier expected. 'interface' is a reserved word in strict mode.
```

It means a variable named `interface` is used in code (e.g., a map callback). Rename it to a non-reserved identifier, e.g.:

```jsx
{uniqueInterfaces.map(interfaceName => (
  <option key={interfaceName} value={interfaceName}>{interfaceName}</option>
))}
```

The project already uses `interfaceName` to avoid this issue.

---

## App Entrypoints

### `src/main.jsx`
- Creates the React root and renders `<App />` inside `<StrictMode>`

### `src/App.jsx`
- Imports global CSS and renders `<InterfaceMonitoringDashboard />`

### `index.html`
- Base HTML with `#root` and a module script loading `/src/main.jsx`

---

## Performance Considerations
- Filtering and metrics computed via `useMemo` and `useEffect`
- Large dataset (100k rows) is handled via slicing/pagination
- For ultra-large data or slower devices, consider:
  - Virtualized table rendering (e.g. `react-window`)
  - Web workers for heavy pre-processing
  - Server-side pagination when backed by an API

## Deployment

This project is Vite-based and well-suited for static hosting.

- Build: `npm run build` (outputs `dist/`)
- Deploy the `dist/` directory to your host (Vercel/Netlify/Cloudflare Pages/etc.)
- Live example is hosted on Vercel: https://hr-dashboard-rust-tau.vercel.app/

Vercel Setup (high-level):
1. Import the GitHub repo
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

## License

Open source. Add a specific license if desired (e.g., MIT) in a `LICENSE` file.

## Acknowledgements
- Icons by `lucide-react`
- Charts by `recharts`
- Tooling by Vite
