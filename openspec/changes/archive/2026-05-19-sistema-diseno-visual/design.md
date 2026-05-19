## Context

The Food Store application currently consists of 19 screens spanning from authentication, to e-commerce catalogs, to admin dashboards. However, it lacks a cohesive design language. We are adopting the "Vivid Modernity" design system created in Google Stitch to unify the UI/UX. The tech stack is React + TypeScript with Tailwind CSS.

## Goals / Non-Goals

**Goals:**
- Implement all design tokens (Colors, Typography, Radius, Layouts) from the Stitch asset ID `12111847708589704504`.
- Centralize styling through `tailwind.config.js` overriding the default theme.
- Establish a global Base Layout (collapsible aside + light header) for all non-auth pages.
- Ensure all 19 screens conform to the new design system.

**Non-Goals:**
- Creating new backend API endpoints or altering the database schema.
- Re-architecting the state management (e.g., Redux or React Query).
- Functional logic changes not related to visual UI state.

## Decisions

- **Tailwind Config Extension vs Overwrite**: We will overwrite (`theme.colors` and `theme.fontFamily`) to strictly enforce the "Vivid Modernity" palette and prevent developers from using legacy default tailwind colors (like `blue-500`).
- **CSS Variables**: Core colors will be defined directly in Tailwind config using hex values.
- **Base Layout Implementation**: We will create a `MainLayout` component that wraps the router's `<Outlet />`. Auth pages will use a minimal `AuthLayout`.
- **Fonts Loading**: `Outfit` and `Inter` will be imported via Google Fonts in the root `index.css`.

## Risks / Trade-offs

- **Risk**: UI breakage on existing screens due to strict color overrides.
  - **Mitigation**: We will review each of the 19 screens and update classes from generic tailwind colors to the semantic colors defined in the new palette.
- **Risk**: The collapsible sidebar state might affect global layout shifts.
  - **Mitigation**: Use Tailwind Grid or Flexbox with CSS transitions and a fixed width for the aside to ensure smooth resizing without jumping content.
