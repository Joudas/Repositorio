## Phase 1: Implement `imageUrl` for Links

### 1.1 Backend (Next.js API Route for Image Upload)
-   **Endpoint:** Create a new API route at `/api/upload-image`.
-   **File Handling:**
    -   Utilize a library (e.g., `formidable`) to parse `multipart/form-data` requests.
    -   Validate incoming files: ensure they are images (`accept="image/*"` on frontend) and adhere to size limits.
-   **Image Processing:**
    -   Integrate `sharp` for image manipulation.
    -   Resize images to a maximum of `800px x 800px`.
    -   **Crop from center** to achieve a square aspect ratio if the original image is not square.
    -   Optimize image quality for web display (e.g., compress to JPEG or WebP).
-   **Local Storage:**
    -   Store processed images in a dedicated directory: `public/uploads/`.
    -   Generate unique filenames (e.g., using UUIDs) for each uploaded image to prevent collisions.
-   **Database Update (Neon/Prisma):**
    -   After successful processing and storage, update the corresponding `Link` entry in the Prisma database.
    -   Store the **relative public URL** of the image (e.g., `/uploads/unique-image-id.jpg`) in the `imageUrl` field of the `Link` model.
-   **Error Handling:** Implement comprehensive error handling for:
    -   Invalid file types or sizes.
    -   Image processing failures.
    -   Database update errors.
    -   Return appropriate HTTP status codes and detailed error messages.

### 1.2 Frontend (Link Creation/Editing Form)
-   **File Input:** Add an HTML `<input type="file" accept="image/*">` element to the link creation/editing forms.
-   **Client-Side Preview:**
    -   Implement functionality to display a real-time preview of the selected image using `URL.createObjectURL`.
    -   Provide clear feedback if the image doesn't meet size/aspect ratio recommendations.
-   **Upload Logic:**
    -   Use `FormData` to package and send the image file along with other link data to the `/api/upload-image` endpoint.
    -   Display a loading indicator during the upload process.
    -   Provide user feedback (success, error) using the global `Toast` notification system.

## Phase 2: User Profiles and Link Display

### 2.1 Database Schema Enhancements (Prisma)
-   **`Link` Model:**
    -   Add an `order: Int @default(0)` field to the `Link` model to allow users to customize the display order of their links on their profile page.
-   **`User` Model:**
    -   Confirm or add a `displayName: String @unique` field in the `User` model. This field will be user-editable and will serve as the unique identifier for public profile URLs (e.g., `/p/[displayName]`).
    -   Consider adding a `bio: String?` field for a short user description on the public profile.

### 2.2 Authenticated User Configuration/Dashboard Page (`/u`)
-   **Route:** `/u` (e.g., `minilinktree.com/u`) will serve as the authenticated user's personal dashboard for managing their links and profile settings.
-   **Authentication:** Secure this route using NextAuth to ensure only the logged-in user can access and modify their own data.
-   **Data Fetching:**
    -   Utilize `react-query` for efficient client-side data fetching, caching, and state management of the authenticated user's links and profile information.
    -   Implement mutations for updating and deleting links and user profile data.
-   **Link Management UI:**
    -   Display the authenticated user's links, showing title, URL, and the `imageUrl`.
    -   Implement a drag-and-drop interface (e.g., using `react-beautiful-dnd`) for reordering links.
    -   Provide "Edit" and "Delete" actions for each link.
-   **User Profile Editor:**
    -   Include a form or modal allowing the user to edit their `displayName`, `bio`, and other relevant profile details.

### 2.3 Public User Linktree Page (`/p/[displayName]`)
-   **Route:** `/p/[displayName]` (e.g., `minilinktree.com/p/john_doe`) will be the public-facing linktree profile page.
-   **Dynamic Routing:** Implement dynamic routing in Next.js to handle `[displayName]` as a URL parameter.
-   **Data Fetching:**
    -   Fetch user details and their associated public links based on the `displayName` extracted from the URL. This will likely involve a server-side data fetch or an API route.
-   **Display:**
    -   Render the user's `displayName` and `bio` (if available).
    -   Display their ordered links, each with its title, URL, and `imageUrl`.
    -   **Default Icon:** If a link's `imageUrl` is `null` or empty, display a default icon using the `react-icons` library. I will research suitable generic link icons (e.g., `FaLink` from `react-icons/fa`).
-   **SEO:** Implement appropriate meta tags for social media sharing and search engine visibility.
-   **Error Handling:** Gracefully handle cases where the `displayName` in the URL does not correspond to an existing user, displaying a custom 404 page.

## Phase 3: General Enhancements & Error Handling

### 3.1 Global Error Handling
-   **API Routes:**
    -   Standardize error responses across all API routes, returning consistent JSON structures with clear error messages and appropriate HTTP status codes.
-   **Frontend:**
    -   Implement a global `ErrorBoundary` component in React to catch and display UI errors gracefully.
    -   Ensure custom error pages (`pages/404.tsx` and `pages/500.tsx`) are correctly configured in Next.js.

### 3.2 Next.js Alerts (Notifications)
-   **`Toast` Component:** Develop a reusable, consistent `Toast` or notification component for displaying user feedback.
-   **Integration:** Integrate the `Toast` component with:
    -   Form submissions (success/failure messages).
    -   `react-query` mutations (automatically display success/error for data operations).
    -   General informational messages.

### 3.3 State Management (Zustand) & Data Fetching (React Query)
-   **React Query:**
    -   Primary tool for managing **server-state** (data fetched from the API, mutations for updates/deletes).
    -   Benefits: Caching, background refetching, automatic retries, optimized mutations, loading/error states.
-   **Zustand:**
    -   Utilize for managing **local UI state** where `useState` becomes cumbersome.
    -   Examples: Modal open/close states, global theme toggles, form states that are not immediately persisted to the server.

## Technologies and Libraries to Consider/Utilize
-   **Backend:** Next.js API Routes, Prisma, NextAuth.js, `formidable` (for file upload), `sharp` (for image processing).
-   **Frontend:** Next.js, React, Tailwind CSS, `react-query`, `zustand`, `react-icons`, `react-beautiful-dnd` (for drag-and-drop).
-   **Database:** Neon (PostgreSQL).