---
name: Vivid Modernity
colors:
  surface: '#fff8f7'
  surface-dim: '#eed4d4'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f0'
  surface-container: '#ffe9e9'
  surface-container-high: '#fde2e2'
  surface-container-highest: '#f7dcdd'
  on-surface: '#261819'
  on-surface-variant: '#5a4042'
  inverse-surface: '#3d2c2d'
  inverse-on-surface: '#ffeced'
  outline: '#8e7071'
  outline-variant: '#e2bebf'
  surface-tint: '#b71d3f'
  primary: '#b3193d'
  on-primary: '#ffffff'
  primary-container: '#d63653'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb2b7'
  secondary: '#6d4e9f'
  on-secondary: '#ffffff'
  secondary-container: '#c8a6fe'
  on-secondary-container: '#553685'
  tertiary: '#006a42'
  on-tertiary: '#ffffff'
  tertiary-container: '#008655'
  on-tertiary-container: '#f6fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdadb'
  primary-fixed-dim: '#ffb2b7'
  on-primary-fixed: '#40000e'
  on-primary-fixed-variant: '#91002b'
  secondary-fixed: '#ecdcff'
  secondary-fixed-dim: '#d6baff'
  on-secondary-fixed: '#280057'
  on-secondary-fixed-variant: '#553685'
  tertiary-fixed: '#84f9ba'
  tertiary-fixed-dim: '#67dc9f'
  on-tertiary-fixed: '#002111'
  on-tertiary-fixed-variant: '#005232'
  background: '#fff8f7'
  on-background: '#261819'
  surface-variant: '#f7dcdd'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for high-growth tech platforms that require a balance between energetic vibrancy and professional reliability. The brand personality is forward-leaning, confident, and meticulously organized. It targets a digitally native audience that values speed, clarity, and visual delight.

The aesthetic leans into **Corporate Modernism** with a **High-Contrast** edge. It utilizes generous white space (or deep ink space in dark mode) to let the vibrant primary and secondary colors act as functional signals rather than just decoration. The interface feels "precision-engineered" through the use of geometric typography and a strict adherence to a mathematical spacing scale.

## Colors

The palette is built on a foundation of high-contrast pairings. The primary color (#e94560) is reserved for the most critical actions and brand moments. The secondary color (#533483) provides a sophisticated anchor for navigation and secondary interactive elements.

In **Light Mode**, we prioritize `#ffffff` for primary surfaces and `#f8f9fa` for secondary containers to create subtle depth. In **Dark Mode**, `#1a1a2e` serves as the canvas, creating a deep, immersive environment where the vibrant primary red-pink "pops" with exceptional legibility. Grayscale values are slightly tinted with the secondary violet to maintain a cohesive atmospheric feel across the UI.

## Typography

This design system employs a dual-font strategy to differentiate between brand expression and functional utility. **Outfit** is used for all headlines; its geometric construction and wide apertures provide a modern, friendly, and high-tech feel. **Inter** is used for body text and UI labels due to its exceptional readability at small sizes and its neutral, systematic character.

We utilize a tight tracking (letter-spacing) for large headlines to keep them punchy and impactful, while smaller labels use slightly increased tracking to ensure legibility on mobile displays. Line heights are generous to prevent visual fatigue during long reading sessions.

## Layout & Spacing

The layout is built on a **4px baseline grid** with a mobile-first philosophy. We utilize a **Fluid Grid** system that transitions from a 4-column layout on mobile to a 12-column layout on desktop (breakpoint: 1024px).

Spacing is strictly derived from a geometric scale. On mobile devices, the standard outer margin is 16px to maximize content area, while desktop increases this to 32px or 48px to allow the UI to breathe. Gutters are fixed at 16px to ensure a consistent rhythm between cards and columns regardless of screen width. Vertical spacing between logical sections should default to `2xl` (48px) on mobile and `3xl` (64px) on desktop to clearly demarcate the visual hierarchy.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Tonal Layers**. We avoid heavy, black shadows in favor of diffused, low-opacity shadows tinted with the secondary color (#533483) to maintain color harmony.

- **Level 0 (Base):** The main background surface.
- **Level 1 (Cards):** Uses a subtle shadow (Y: 4px, Blur: 12px, Opacity: 6%) to lift content slightly.
- **Level 2 (Dropdowns/Popovers):** Uses a medium shadow (Y: 8px, Blur: 24px, Opacity: 10%) for clear separation.
- **Level 3 (Modals):** Uses a high-contrast shadow (Y: 16px, Blur: 48px, Opacity: 15%) and a background dimming overlay (60% opacity) to focus user attention entirely.

In Dark Mode, elevation is communicated primarily through lighter surface colors (tonal layering) rather than shadows, moving from #1a1a2e to slightly lighter shades of navy/violet for higher-level elements.

## Shapes

The shape language is consistently "Soft-Rounded." This design system uses a 0.5rem (8px) corner radius as the standard for core UI components like cards and input fields. To create a more immersive and distinct feel for larger structural elements like modals or bottom sheets, the radius is increased to 12px (0.75rem).

Interactive elements like buttons follow the 8px standard but can transition to pill-shaped for specific "Action-Only" contexts like chips or tags. This consistency in rounding ensures the UI feels approachable and modern without appearing overly juvenile.

## Components

### Buttons
Primary buttons use the Primary Color (#e94560) with white text and no border. Secondary buttons use an outline style with the Secondary Color (#533483). All buttons feature an 8px radius and a minimum height of 48px for mobile accessibility.

### Input Fields
Inputs use a white background with a 1px border (#dee2e6). On focus, the border transitions to the Primary Color with a subtle 2px glow. Labels are set in `label-md` using Inter Bold.

### Cards
Cards are the primary container. They utilize the 8px border radius, a white background, and a Level 1 shadow. Padding within cards is strictly 24px (`lg`) for desktop and 16px (`md`) for mobile.

### Chips
Small, 32px height elements with a 16px (pill) radius. Used for filtering and categorization. Backgrounds should be light tints (10% opacity) of the brand colors with high-contrast text.

### Modals
Modals feature a 12px corner radius, centered on desktop and appearing as "Bottom Sheets" on mobile to optimize for thumb-reach. They always include a 24px header area with a clear 'X' close action in the top right.