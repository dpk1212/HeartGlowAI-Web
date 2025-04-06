# HeartGlowAI CSS Architecture Guide

This document provides instructions on how to use the new CSS architecture in the HeartGlowAI project.

## Getting Started

### Including CSS in Pages

All HTML pages should include the main CSS file:

```html
<link rel="stylesheet" href="css/main.css">
```

This file imports all other CSS files in the correct order.

### Page Structure

Each page should have a page class on the body element to scope styles:

```html
<!-- Example: Intention page -->
<body class="intention-page">
  <!-- page content -->
</body>

<!-- Example: Tone page -->
<body class="tone-page">
  <!-- page content -->
</body>
```

## BEM Naming Convention

We use the Block-Element-Modifier (BEM) methodology for class naming:

### Structure

- Block: `.block`
- Element: `.block__element`
- Modifier: `.block--modifier` or `.block__element--modifier`

### Example

```html
<div class="card">
  <div class="card__header">
    <h2 class="card__title">Card Title</h2>
  </div>
  <div class="card__content">
    Content here
  </div>
  <div class="card__footer">
    <button class="card__action card__action--primary">Action</button>
  </div>
</div>
```

## Using CSS Variables

All design tokens are defined as CSS variables in `css/base/variables.css`. Always use these variables instead of hardcoded values:

```css
/* Incorrect */
.element {
  color: #8a57de;
  padding: 16px;
  border-radius: 12px;
}

/* Correct */
.element {
  color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}
```

## Common Components

### Card Component

```html
<!-- Basic card -->
<div class="card">
  <div class="card__header">
    <h2 class="card__title">Card Title</h2>
  </div>
  <div class="card__content">
    Content here
  </div>
</div>

<!-- Card with modifiers -->
<div class="card card--primary card--elevated">
  <!-- content -->
</div>
```

### Option Card Component

```html
<!-- Regular option card -->
<div class="option-card">
  <div class="option-card__icon">
    <i class="fas fa-heart"></i>
  </div>
  <h3 class="option-card__title">Option Title</h3>
  <p class="option-card__description">Description text</p>
</div>

<!-- Selected option card -->
<div class="option-card option-card--selected">
  <!-- content -->
</div>
```

### Message Card Component

```html
<div class="message-card">
  <div class="message-card__header">
    <div class="message-card__recipient-info">
      <span class="message-card__recipient">Recipient Name</span>
      <span class="message-card__type">
        <i class="message-card__type-icon fas fa-heart"></i>
        Romantic
      </span>
    </div>
    <div class="message-card__date">
      <i class="message-card__date-icon fas fa-clock"></i>
      2 days ago
    </div>
  </div>
  <p class="message-card__body">Message content here...</p>
  <div class="message-card__actions">
    <button class="message-card__action message-card__action--view">
      <i class="fas fa-eye"></i> View
    </button>
    <button class="message-card__action message-card__action--delete">
      <i class="fas fa-trash"></i> Delete
    </button>
  </div>
</div>
```

## Page-Specific Styling

Page-specific styles should be in their own CSS file in the `css/pages/` directory and follow the same BEM naming convention, prefixed with the page name:

```css
/* In css/pages/intention.css */
.intention-page__header {
  /* styles */
}

.intention-page__title {
  /* styles */
}
```

## Adding New Components

1. Determine if the component can be built from existing components
2. If not, create a new component file in the `css/components/` directory
3. Use BEM naming for the component
4. Update `main.css` to include the new component file

## Migration Strategy

We are gradually migrating from the old CSS structure to the new architecture:

1. New features should use the new architecture
2. When modifying existing features, try to convert them to the new style
3. Eventually, all legacy CSS in `styles.css` will be moved into the new architecture 