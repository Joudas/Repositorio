# Spec: Dashboard Page & Board Refactor

## 1. Error Fix — Remove React.StrictMode

### Problem
`<React.StrictMode>` in `main.tsx` double-invokes effects and ref callbacks in development. With Vite 8's HMR and the current Express backend port setup, StrictMode causes a "disconnected port" WebSocket error that breaks hot reload reliability.

### Change
**File**: `Frontend/src/main.tsx`
**Action**: Remove `<StrictMode>` wrapper, keep everything else unchanged.

**Before**:
```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App/>
    </QueryClientProvider>
  </StrictMode>
);
```

**After**:
```tsx
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App/>
  </QueryClientProvider>
);
```

Also remove the `StrictMode` import from `"react"`.

### Rationale
The disconnected port error is a known Vite + StrictMode interaction with custom WebSocket HMR implementations. Removing StrictMode is the minimal fix. The app does not rely on StrictMode's double-render for correctness — all side-effects are properly handled via useEffect cleanup or React Query.

---

## 2. Dashboard Screen

### 2.1 New Feature Directory
```
Frontend/src/features/dashboard/
  DashboardScreen.tsx     # default export — main component
  components/
    BoardTile.tsx          # individual board tile
    CreateBoardDialog.tsx  # modal/dialog for creating a new board
    EmptyState.tsx         # shown when user has 0 boards
    ErrorState.tsx         # shown when API call fails
    LoadingState.tsx       # skeleton/loading indicator
```

### 2.2 Component: DashboardScreen

**Location**: `Frontend/src/features/dashboard/DashboardScreen.tsx`
**Export**: `export default function DashboardScreen()`

**States**:

| State     | Trigger                 | UI                                                            |
|-----------|-------------------------|---------------------------------------------------------------|
| Loading   | `useQuery` is loading   | `<LoadingState />` — centered spinner or skeleton grid        |
| Empty     | `data` is empty array   | `<EmptyState />` — "No boards yet" message + "Create Board"   |
| Error     | `useQuery` has error    | `<ErrorState />` — "Failed to load boards" + "Try again"      |
| Normal    | `data` has boards       | Grid of `<BoardTile />` + floating "Create Board" button      |

**Data fetching**:
```tsx
const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ["boards"],
  queryFn: getBoardsList,
});
```

**Layout**:
- Full-screen authenticated page background (`bg-gray-6` or similar dark bg)
- Shared `<Header />` at top (see §3)
- Main area: responsive grid of board tiles
- Grid: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-8`

### 2.3 Component: BoardTile

**Props**:
```tsx
type BoardTileProps = {
  board: Board;  // { id: string; name: string }
};
```

**Behavior**:
- Clicking the tile navigates to `/board/${board.id}` via `useNavigate`
- Simple card: board name in center, subtle hover effect (scale or background change)
- Show a small icon or accent to make tiles recognizable

### 2.4 Component: CreateBoardDialog

**Where**: `Frontend/src/features/dashboard/components/CreateBoardDialog.tsx`
**Export**: `export default function CreateBoardDialog`

**Props**:
```tsx
type CreateBoardDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};
```

**Behavior**:
- If the same form logic as `FormBoard.tsx`, either reuse or adapt
- On success, navigate to the new board: `navigate(\`/board/${board.id}\`)`
- Uses `postBoard` from `@/services/board`

### 2.5 Component: EmptyState / ErrorState / LoadingState

Simple presentational components. Single file each or one file with named exports — keep consistent with the project's default-export pattern.

---

## 3. Header Extraction

### 3.1 New Location
```
Frontend/src/components/layout/
  Header.tsx     # extracted from board/components/Header.tsx
```

### 3.2 Header Props

The extracted Header needs one behavioral difference: the "Create" button should **only** appear on the Dashboard screen (where creating a board makes sense), not inside a board view (where it's confusing).

```tsx
type HeaderProps = {
  showCreateBoard?: boolean;  // default true — show the Create button
};
```

### 3.3 Import Changes

**Before** (inside board/components/Header.tsx):
```tsx
import FormBoard from './FormBoard';
import Search from './Search';
import Settings from './Settings';
```

**After** (in src/components/layout/Header.tsx):
```tsx
import FormBoard from '@/features/board/components/Navigation/FormBoard';
import Search from '@/features/board/components/Navigation/Search';
import Settings from '@/features/board/components/Navigation/Settings';
```

(The Navigation/ sub-folder is part of the reorg in §4.)

### 3.4 Behavior

- When `showCreateBoard` is `false`, the "Create" button and its `<FormBoard />` popover are not rendered.
- All other features (Search, Settings menu) remain the same.

### 3.5 Update Consumers

| File | Old Import | New Import |
|------|-----------|------------|
| `BoardScreen.tsx` | `import Header from "./components/Header"` | `import Header from "@/components/layout/Header"` — use `<Header showCreateBoard={false} />` |
| `DashboardScreen.tsx` | (new) | `import Header from "@/components/layout/Header"` — use `<Header showCreateBoard={true} />` |

---

## 4. Folder Reorganization

### 4.1 Target Structure

```
Frontend/src/features/board/components/
  Layout/
    Main.tsx
    InBoxBar.tsx
    InBox.tsx
    index.ts          # re-exports default exports
  Card/
    Card.tsx
    AddCardForm.tsx
    InBoxCard.tsx
    index.ts
  Todo/
    Todo.tsx
    TodoAdd.tsx
    TodoModal.tsx
    TodoOverlay.tsx
    index.ts
  Checkbox/
    CheckBox.tsx
    AnimationPresenceCheck.tsx
    index.ts
  Comment/
    Comment.tsx
    index.ts
  Navigation/
    Search.tsx
    Settings.tsx
    FormBoard.tsx
    index.ts
  dnd/                          # already exists, empty — keep as-is
```

### 4.2 index.ts Pattern

Each sub-folder's `index.ts` re-exports the default export from each file in that folder:

```tsx
// Example: Layout/index.ts
export { default as Main } from "./Main";
export { default as InBox } from "./InBox";
export { default as InBoxBar } from "./InBoxBar";
```

### 4.3 Import Path Updates

#### BoardScreen.tsx (feature root)

| Current Import | New Import |
|----------------|------------|
| `import Header from "./components/Header"` | `import Header from "@/components/layout/Header"` |
| `import InBox from "./components/InBox"` | `import { InBox } from "./components/Layout"` |
| `import Main from "./components/Main"` | `import { Main } from "./components/Layout"` |
| `import InBoxBar from "./components/InBoxBar"` | `import { InBoxBar } from "./components/Layout"` |

#### App.tsx

| Current Import | New Import |
|----------------|------------|
| `import TodoModal from "@/features/board/components/TodoModal"` | `import { TodoModal } from "@/features/board/components/Todo"` |

#### Card.tsx (now Card/Card.tsx)

| Current Import | New Import |
|----------------|------------|
| `import Todo from "./Todo"` | `import { Todo } from "../Todo"` |
| `import TodoAdd from "./TodoAdd"` | `import { TodoAdd } from "../Todo"` |

#### InBoxCard.tsx (now Card/InBoxCard.tsx)

| Current Import | New Import |
|----------------|------------|
| `import TodoAdd from "./TodoAdd"` | `import { TodoAdd } from "../Todo"` |
| `import Todo from "./Todo"` | `import { Todo } from "../Todo"` |

#### InBox.tsx (now Layout/InBox.tsx)

| Current Import | New Import |
|----------------|------------|
| `import InBoxCard from "./InBoxCard"` | `import { InBoxCard } from "../Card"` |

#### Main.tsx (now Layout/Main.tsx)

| Current Import | New Import |
|----------------|------------|
| `import Card from "./Card"` | `import { Card } from "../Card"` |
| `import AddCardForm from "./AddCardForm"` | `import { AddCardForm } from "../Card"` |

#### TodoModal.tsx (now Todo/TodoModal.tsx)

| Current Import | New Import |
|----------------|------------|
| `import Comment from "./Comment"` | `import { Comment } from "../Comment"` |
| `import AnimationPresenceCheck from "./AnimationPresenceCheck"` | `import { AnimationPresenceCheck } from "../Checkbox"` |

#### Todo.tsx (now Todo/Todo.tsx)

| Current Import | New Import |
|----------------|------------|
| `import CheckBox from "./CheckBox"` | `import { CheckBox } from "../Checkbox"` |

#### TodoOverlay.tsx (now Todo/TodoOverlay.tsx)

| Current Import | New Import |
|----------------|------------|
| `import CheckBox from "./CheckBox"` | `import { CheckBox } from "../Checkbox"` |

#### CheckBox.tsx (now Checkbox/CheckBox.tsx)

| Current Import | New Import |
|----------------|------------|
| `import AnimationPresenceCheck from "./AnimationPresenceCheck"` | `import { AnimationPresenceCheck } from "./AnimationPresenceCheck"` (same folder — keep relative) |

#### Header.tsx (new location `src/components/layout/Header.tsx`)

| Current Import | New Import |
|----------------|------------|
| `import FormBoard from './FormBoard'` | `import { FormBoard } from '@/features/board/components/Navigation'` |
| `import Search from './Search'` | `import { Search } from '@/features/board/components/Navigation'` |
| `import Settings from './Settings'` | `import { Settings } from '@/features/board/components/Navigation'` |

---

## 5. Route Update

### 5.1 RouterEngine.tsx Changes

**File**: `Frontend/src/components/RouterEngine.tsx`

**Before**:
```tsx
import BoardScreen from "@/features/board/BoardScreen";
// ...
<Route element={<ProtectedRoute />}>
  <Route path="/board/:id" element={<BoardScreen />} />
  <Route
    path="/"
    element={
      <div className="p-8 text-2xl font-bold">ZenTrack — Home</div>
    }
  />
</Route>
```

**After**:
```tsx
import BoardScreen from "@/features/board/BoardScreen";
import DashboardScreen from "@/features/dashboard/DashboardScreen";
// ...
<Route element={<ProtectedRoute />}>
  <Route path="/board/:id" element={<BoardScreen />} />
  <Route path="/" element={<DashboardScreen />} />
</Route>
```

### 5.2 Route Table (updated)

| Path         | Component        | Auth      |
|--------------|------------------|-----------|
| `/login`     | `LoginScreen`    | Public    |
| `/register`  | `RegisterScreen` | Public    |
| `/`          | `DashboardScreen`| Protected |
| `/board/:id` | `BoardScreen`    | Protected |
| `*`          | Redirect to `/`  | —         |

---

## 6. Scenarios

### 6.1 Normal Flow (boards exist)
1. User logs in → redirected to `/`
2. `<AppWrapper>` in RouterEngine checks session → `isLoading = false`
3. `<DashboardScreen />` renders `<Header showCreateBoard={true} />`
4. `useQuery` fires `getBoardsList()` → returns `Board[]`
5. Grid of `<BoardTile />` renders. Each shows board name.
6. User clicks a tile → navigates to `/board/:id`
7. `<BoardScreen />` renders `<Header showCreateBoard={false} />` + board UI

### 6.2 Empty State (no boards)
1. Same flow, but `getBoardsList()` returns `[]`
2. `<EmptyState />` renders: "No boards yet. Create your first board to get started."
3. User clicks "Create Board" → `<CreateBoardDialog />` opens
4. User enters title, submits → `postBoard()` → success → navigate to `/board/${newBoard.id}`

### 6.3 Error State (API failure)
1. `getBoardsList()` throws (network error, 401, 500)
2. `<ErrorState />` renders: "Failed to load boards" + error message excerpt
3. "Try again" button calls `refetch()`

### 6.4 Loading State
1. Initial render while `getBoardsList()` is in flight
2. `<LoadingState />` renders: spinner or skeleton grid (3-4 placeholder tiles)
3. Transitions to Normal, Empty, or Error state on resolution

### 6.5 StrictMode Fix
1. App starts in dev with HMR
2. No WebSocket disconnected-port errors
3. Effects run once (not double-invoked)

### 6.6 Header Extraction
1. Header appears identically in DashboardScreen and BoardScreen
2. DashboardScreen shows "Create" button; BoardScreen hides it
3. Search and Settings work identically in both contexts

### 6.7 Reorg No-Regression
1. All board screens render without missing imports
2. Drag-and-drop still works (no import paths broken)
3. TodoModal still opens with comments and animations
4. Search, Settings, and FormBoard popovers still function
