---
name: Olive Noir
colors:
  surface: '#131407'
  surface-dim: '#131407'
  surface-bright: '#393a29'
  surface-container-lowest: '#0e0f03'
  surface-container-low: '#1b1d0e'
  surface-container: '#1f2111'
  surface-container-high: '#2a2b1b'
  surface-container-highest: '#343625'
  on-surface: '#e4e4cc'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e4e4cc'
  inverse-on-surface: '#303221'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c8c6c5'
  primary: '#c8c6c5'
  on-primary: '#313030'
  primary-container: '#121212'
  on-primary-container: '#7e7d7d'
  inverse-primary: '#5f5e5e'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary: '#ffb68c'
  tertiary-container: '#240b00'
  on-tertiary: '#532200'
  on-tertiary-container: '#b96935'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#753401'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  background: '#131407'
  on-background: '#e4e4cc'
  surface-variant: '#343625'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
rounded:
  DEFAULT: 0.125rem
  lg: 0.25rem
  xl: 0.5rem
  full: 0.75rem
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  container-max: 1200px
---

## Brand & Style

The design system is built for a premium culinary experience with a dark, sophisticated aesthetic. The brand personality is bold, elegant, and uncompromisingly luxurious. It targets a discerning audience that values quality, ambiance, and visual craftsmanship.

The aesthetic is **Olive Noir** — a dark-first approach with deep olive-black canvases (`#131407`) serving as the stage for warm gold accents (`#e9c349`) and silver-gray primary tones (`#c8c6c5`). The interface feels like a private members club: intimate, warm, and meticulously curated.

## Colors

The palette is anchored by a dark-only philosophy. Backgrounds use deep olive-black (`#131407`) with warm cream text (`#e4e4cc`) for exceptional contrast. The primary color (`#c8c6c5`) provides a sophisticated silver-gray for UI elements, while secondary gold (`#e9c349`) is reserved for brand moments, accents, and critical actions.

Surfaces use a carefully crafted tonal hierarchy of warm olive tones (`#0e0f03` → `#1b1d0e` → `#1f2111` → `#2a2b1b` → `#343625`) to create depth without feeling sterile. The outline colors use muted green-grays for subtle borders.

## Typography

This design system employs a dual-font strategy to differentiate between brand expression and functional utility. **Playfair Display** is used for all headlines; its elegant serif construction and high contrast provide a sophisticated, editorial feel. **Manrope** is used for body text and UI labels due to its exceptional readability and modern geometric character.

## Layout & Spacing

The layout is built on an **8px baseline grid** with a mobile-first philosophy. Spacing uses a geometric scale with `unit` (8px) as the foundation. Outer margins are 20px on mobile and 64px on desktop for a spacious, premium feel. Gutters are fixed at 24px to ensure consistent rhythm.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers**. Since the base is very dark, elevation is communicated primarily through progressively lighter surface colors rather than shadows. The surface container ladder moves from `#0e0f03` (lowest) to `#343625` (highest).

## Shapes

The shape language is "Sharp-Minimal" with subtle rounding. Core UI components use a minimal `0.125rem` (2px) radius. Cards and elevated surfaces use `0.25rem` (4px) and `0.5rem` (8px) respectively. Full rounding is capped at `0.75rem` (12px) for pill-shaped elements.
