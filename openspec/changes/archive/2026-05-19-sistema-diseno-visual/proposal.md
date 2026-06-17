## Why

The current application lacks a cohesive and standardized visual language across its numerous screens (19 panels in total). Implementing the "Vivid Modernity" design system ensures a unified, premium, and professional user experience across all pages (from Auth to Admin dashboards) while streamlining future UI development.

## What Changes

- Complete adoption of the "Vivid Modernity" design system based on Google Stitch assets (ID 12111847708589704504).
- Implementation of a unified color palette (`tailwind.config.js`) featuring primary reds (#b3193d), secondary violets (#6d4e9f), tertiary greens (#006a42), and tinted warm white surfaces.
- Standardization of typography utilizing Outfit (600-700) for headlines and Inter (400-600) for body and labels.
- Standardization of border radii across all components: 8px for cards/inputs, 12px for modals, and full radius for chips.
- Implementation of a unified Base Layout for the entire app (excluding auth), featuring a lightweight header and a collapsible aside.
- Global refactoring of existing components to adhere to the new design tokens.

## Capabilities

### New Capabilities
- `visual-design-system`: Defines the core design tokens (colors, typography, spacing, radius) and global layout structure for the application.

### Modified Capabilities
- `frontend-foundation`: The base Tailwind CSS theme requirements are updated to enforce the "Vivid Modernity" palette and typography.

## Impact

- `tailwind.config.js` and global CSS files will be heavily modified to include new tokens.
- All 19 existing pages (Auth, Public, User, Admin) will be visually updated.
- Existing React components (buttons, inputs, cards, modals, layout wrappers) will be restyled.
- No backend or database schemas are affected.
