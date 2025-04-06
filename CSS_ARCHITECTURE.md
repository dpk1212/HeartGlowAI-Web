# CSS Architecture for HeartGlowAI

This document outlines the CSS architecture strategy for the HeartGlowAI web application.

## Core Principles

1. **Component-based approach**: CSS should be organized by reusable components
2. **Scoped styles**: Prevent styles from one component affecting others
3. **Theme consistency**: Use CSS variables for colors, spacing, and typography
4. **Maintainability**: Clear organization and naming conventions
5. **Performance**: Minimize CSS size and specificity conflicts

## Directory Structure

```
/css
├── /base
│   ├── reset.css        # CSS reset/normalize
│   ├── typography.css   # Font definitions and text styles
│   └── variables.css    # CSS custom properties (variables)
├── /components
│   ├── buttons.css      # Button styles
│   ├── cards.css        # Card component styles
│   ├── forms.css        # Form elements
│   ├── modals.css       # Modal/dialog styles
│   └── navigation.css   # Navigation components
├── /layouts
│   ├── grid.css         # Grid system
│   ├── header.css       # Header layout
│   └── footer.css       # Footer layout
├── /pages
│   ├── home.css         # Home page specific styles
│   ├── intention.css    # Intention page specific styles
│   ├── tone.css         # Tone page specific styles
│   └── message.css      # Message result page specific styles
└── main.css             # Imports all stylesheets
```

## Naming Convention (BEM Methodology)

We'll use the Block-Element-Modifier (BEM) methodology for CSS class naming:

```css
/* Block */
.card { }

/* Element (part of the block) */
.card__title { }
.card__content { }

/* Modifier (variation of the block) */
.card--selected { }
.card--dark { }
```

### Examples:

- `.message-card` (Block)
- `.message-card__header` (Element)
- `.message-card__content` (Element)
- `.message-card--highlighted` (Modifier)

## Theme Variables

All theme-related values should be defined as CSS variables in `variables.css`:

```css
:root {
  /* Colors */
  --color-primary: #8a57de;
  --color-primary-light: #b296ff;
  --color-primary-dark: #7949c9;
  
  --color-background-dark: #1A1625;
  --color-surface-dark: #2D2A3B;
  --color-card-dark: #211E2E;
  
  --color-text-primary: #E8E6F1;
  --color-text-secondary: #b8b5c7;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  
  /* Effects */
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  
  --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 6px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.2);
  
  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
}
```

## Implementation Strategy

1. **Phase 1: Setup**
   - Create directory structure
   - Implement CSS variables in variables.css
   - Create reset.css and typography.css

2. **Phase 2: Component Extraction**
   - Identify and extract common components
   - Create component CSS files with BEM naming
   - Update HTML to use new class names

3. **Phase 3: Page-Specific Styles**
   - Create page-specific CSS files
   - Move unique page styles to these files
   - Reference component styles where needed

4. **Phase 4: Testing & Refinement**
   - Test all pages for visual consistency
   - Refactor and optimize CSS
   - Document any component usage patterns

## Usage Guidelines

### Adding New Components

1. Determine if the component is unique or an extension of an existing one
2. Create styles in the appropriate component file
3. Use BEM naming for elements
4. Use CSS variables for all colors, spacing, etc.

### Page-Specific Styling

1. Page-specific styles should go in the corresponding page CSS file
2. Consider if the style should be a component instead
3. Use the page class as a scope (e.g., `.home-page .special-element`)

### Media Queries

Media queries should be included alongside their relevant selectors:

```css
.card {
  width: 100%;
}

@media (min-width: 768px) {
  .card {
    width: 50%;
  }
}
```

## Performance Considerations

1. Minimize specificity where possible
2. Avoid deep nesting of selectors
3. Group related media queries when possible
4. Consider critical CSS for initial load

## Documentation

All new components should be documented with:
1. HTML structure
2. CSS class names
3. Available modifiers
4. Example usage 