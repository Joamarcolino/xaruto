---
name: Caximbo Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#404942'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707971'
  outline-variant: '#c0c9c0'
  surface-tint: '#2d6a48'
  primary: '#003820'
  on-primary: '#ffffff'
  primary-container: '#0f5132'
  on-primary-container: '#84c39b'
  inverse-primary: '#95d4ac'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#003351'
  on-tertiary: '#ffffff'
  tertiary-container: '#004b74'
  on-tertiary-container: '#68bcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f1c7'
  primary-fixed-dim: '#95d4ac'
  on-primary-fixed: '#002111'
  on-primary-fixed-variant: '#0f5132'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  numeric-hero:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  numeric-table:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-xxs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  max-width-content: 80rem
---

## Brand & Style

The design system embodies a modern, precise, and human-centric financial interface. It bridges rigorous double-entry accounting mechanics (Income Statement/DRE and Balance Sheet) with the intuitive fluidity of contemporary consumer-grade software (drawing aesthetic discipline from Linear, Mercury, and YNAB). 

The emotional tone targets absolute fiscal tranquility, clarity, and competence. It dispels the visual fatigue of dense, tabular enterprise accounting while preserving uncompromised mathematical rigor.

### Key Aesthetic Tenets
- **Precision Minimalism**: Strict alignment, purposeful whitespace, and razor-sharp typographic scale eliminate visual friction.
- **Architectural Depth**: Subtle hairline borders, structural surface tints, and minimal ambient diffusion replace heavy skeuomorphic shadows or opaque drop panels.
- **Semantic Certainty**: Color is never purely decorative. It functions as instantaneous fiscal telemetry—communicating asset health, liability exposure, and operational cash flow at a glance.

## Colors

The palette establishes high semantic rigor with strict WCAG AA compliant contrast ratios across both light and dark operational modes.

### Brand Cores
- **Primary (Forest Emerald)**: `#0F5132` (Light), `#10B981` (Dark Accent). Represents institutional grounding, fiscal growth, and foundational trust.
- **Secondary (Deep Slate Navy)**: `#0F172A`. Serves as the primary anchor for headers, master navigation, and structural contrast.
- **Surface Foundations**:
  - Light: Base `#F8FAFC` (Slate 50), Elevated Card `#FFFFFF`, Border Hairline `#E2E8F0` (Slate 200).
  - Dark: Base `#09090B` (Zinc 950), Elevated Card `#18181B` (Zinc 900), Border Hairline `#27272A` (Zinc 800).

### Semantic Accounting Tints
- **Revenue / Profit / Inflows (Emerald)**:
  - Text/Icon: `#059669` (Dark: `#34D399`)
  - Container/Badge: Light `#ECFDF5`, Dark `#064E3B40`
- **Expenses / Loss / Liabilities (Rose/Coral)**:
  - Text/Icon: `#E11D48` (Dark: `#FB7185`)
  - Container/Badge: Light `#FFF1F2`, Dark `#4C051940`
- **Assets / Liquidity (Sky Blue)**:
  - Text/Icon: `#0284C7` (Dark: `#38BDF8`)
  - Container/Badge: Light `#F0F9FF`, Dark `#082F4940`
- **Equity / Investments / Holdings (Violet)**:
  - Text/Icon: `#7C3AED` (Dark: `#A78BFA`)
  - Container/Badge: Light `#F5F3FF`, Dark `#2E106540`
- **Debt / Payable Obligations (Amber)**:
  - Text/Icon: `#D97706` (Dark: `#FBBF24`)
  - Container/Badge: Light `#FFFBEB`, Dark `#451A0340`

## Typography

The typography system uses **Plus Jakarta Sans** for clean, legible interface text and **JetBrains Mono** for numerical values and accounting labels.

### Tabular Numerical Discipline
- All currency representations, delta percentages, ledger codes, and balances MUST enforce `font-feature-settings: "tnum" 1` and `tabular-nums`. 
- Negative balances use typographic minus signs (`−`, U+2212) or explicit accounting parentheses `(R$ 1.250,00)` rather than hyphen-minuses.
- Numerical columns in tables and balance sheets strictly align right (`text-right`) to preserve vertical decimal scanning.

## Layout & Spacing

The layout is grounded on a disciplined 4px/8px baseline grid that ensures tight vertical cadences in dense data tables and expansive breathing room for high-level summaries.

### Breakpoints & Containers
- **Desktop (≥1280px)**: 12-column dynamic grid, 24px gutters, maximum container constraint of 1280px (`max-w-7xl`). Sidebar navigation fixed at 260px width.
- **Tablet (768px - 1279px)**: Collapsed icon dock (64px width), 8-column layout, dynamic table horizontal scroll with sticky primary identifier columns.
- **Mobile (<768px)**: Single column flow, bottom sticky action navigation, 16px page padding. Large balance displays collapse gracefully to `headline-lg-mobile`.

### Data Density Rules
- High-density ledger rows utilize compact vertical padding (`space-xs` to `space-sm`) to maximize visible records.
- Executive summary modules (Balance Sheet and Income Statement overview cards) use expanded padding (`space-lg` to `space-xl`) to establish hierarchy.

## Elevation & Depth

This design system avoids deep, muddy drop shadows in favor of low-contrast hairline outlines combined with minimal ambient light occlusion.

### Elevation Hierarchy
- **Level 0 (Flat / Canvas)**: `bg-slate-50 dark:bg-zinc-950`. Structural canvas plane. No border, no shadow.
- **Level 1 (Card / Container Base)**: `bg-white dark:bg-zinc-900`. Bounded by a 1px border (`border-slate-200 dark:border-zinc-800/80`). Shadow is ultra-subtle: `0 1px 2px 0 rgb(0 0 0 / 0.03)`.
- **Level 2 (Hover / Active Cards / Dropdowns)**: Elevated by 1px border shift to primary tint or neutral focus (`border-slate-300 dark:border-zinc-700`) with ambient elevation: `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.03)`.
- **Level 3 (Modals / Overlays / Flyouts)**: Retains crisp borders (`border-slate-300 dark:border-zinc-700`) supported by a diffused background scrim (`backdrop-blur-sm bg-slate-950/40`) and soft deep shadow: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)`.

## Shapes

The interface uses standard roundedness (`rounded-lg` = `8px` / `0.5rem`) for cards, buttons, input fields, and modal containers, pairing structural precision with contemporary warmth.

### Shape Scale Rules
- **Inner elements (Badges, Chips, Small inputs)**: `rounded-md` (6px) to maintain geometric proportion within small spatial bounding boxes.
- **Standard elements (Cards, Dialogs, Modals, Action Buttons)**: `rounded-lg` (8px).
- **Indicators / Pill Tags (State Pills, Account Types)**: `rounded-full` strictly for small status indicators to differentiate interactive buttons from static tags.
- **Focus Rings**: Offset by 2px with an inner radius matching the parent container.

## Components

### Buttons
- **Primary**: Deep Forest Emerald (`bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500`). Crisp 8px radius, medium weight typography, 0 1px 2px box-shadow.
- **Secondary / Neutral**: `bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/50`.
- **Destructive**: Subdued rose container (`bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100`).

### Category & Ledger Badges
- Inline category tags with 11px uppercase monospace indicators:
  - **Ativo**: Text `#0284C7`, bg `#F0F9FF`, border `#BAE6FD`.
  - **Passivo**: Text `#D97706`, bg `#FFFBEB`, border `#FDE68A`.
  - **Receita**: Text `#059669`, bg `#ECFDF5`, border `#A7F3D0`.
  - **Despesa**: Text `#E11D48`, bg `#FFF1F2`, border `#FECDD3`.

### DRE & Balance Sheet Summary Cards
- White/Zinc-900 cards featuring structured metrics: Label, large tabular numeric total, sparkline/micro-bar progress indicator, and historical delta indicator (e.g., `+4.2% vs mês anterior` with a trending arrow).

### Ledger Table
- **Zebra Striping**: Alternating rows use `hover:bg-slate-50/80 dark:hover:bg-zinc-800/40` and alternating `bg-slate-50/30 dark:bg-zinc-900/20`.
- **Transaction Route Flow**: Source and destination accounts are formatted with a muted transition arrow: `Conta Corrente Itaú` → `Supermercado` using `text-slate-400` arrow icons.
- **Numerical Alignment**: Values strictly right-aligned, monospaced, colored semantically for credits (+) and debits (-).

### Chart of Accounts Tree (Plano de Contas)
- Nested indentations (`16px` per level) with subtle vertical guide rules (`border-l border-slate-200 dark:border-zinc-800`).
- Collapsible chevrons indicating node states, followed by item count pills (e.g., `12 subcontas`) and parent aggregate totals right-aligned.

### Modals & Dialogs
- Header with title and descriptive context, body containing structured form controls, and footer with right-aligned button clusters:
  - Destructive action (left-aligned if present).
  - Cancel (`Secondary`) followed by Confirm/Save (`Primary`).

### Chrono Navigator (Month / Year Navigation)
- Segmented temporal switch with previous/next arrows, an inline quick-select popover, and presets (`Mês Atual`, `Último Trimestre`, `Ano Fiscal`).