# Agent Hook Setup for Accessibility Checks

This document explains how to set up an agent hook that automatically runs accessibility tests when component files are saved.

## Overview

The accessibility check hook will:
- Trigger automatically when component files in `src/components/` are saved
- Run the accessibility test suite using `npm run test:a11y`
- Report any accessibility violations
- Help maintain WCAG AA compliance throughout development

## Setup Instructions

### 1. Open Kiro Hook UI

Use one of these methods to access the hook configuration:
- Open the Command Palette and search for "Open Kiro Hook UI"
- Navigate to the Explorer view and find the "Agent Hooks" section

### 2. Create New Hook

Click "Create New Hook" or the "+" button to add a new agent hook.

### 3. Configure Hook Settings

Use the following configuration:

**Hook Name:** `Accessibility Check on Component Save`

**Trigger:** `onFileSave`

**File Pattern:** `src/components/**/*.tsx`

**Action:** `runCommand`

**Command:** `npm run test:a11y`

### 4. Hook Behavior

When configured, the hook will:
1. Detect when any `.tsx` file in `src/components/` is saved
2. Automatically run `npm run test:a11y`
3. Display test results in the output panel
4. Report any accessibility violations found

## What Gets Tested

The `test:a11y` script runs the comprehensive accessibility test suite that validates:

### Color Contrast (Property 16)
- WCAG AA contrast standards for CRT green theme (4.5:1 for normal text, 3:1 for large text)
- WCAG AA contrast standards for CRT amber theme
- Contrast ratios for headings and large text
- Contrast utility function accuracy

### Screen Reader Compatibility (Property 17)
- ARIA labels on ArticleCard components
- Semantic HTML structure in ArticleView
- ARIA labels on interactive buttons
- ARIA attributes on CategoryFilter
- ARIA attributes on SettingsPanel toggles
- ARIA attributes on form inputs
- Back button ARIA labels
- Keyboard accessibility for all interactive elements

### Visual Effects Independence (Property 21)
- Theme attribute maintenance with accessibility settings
- CRT color scheme preservation when reduceMotion is enabled
- CRT color scheme preservation when disableBlur is enabled

## Test Results

All 15 accessibility tests currently pass:
- 4 color contrast tests
- 8 screen reader compatibility tests
- 3 visual effects independence tests

## Manual Testing

You can also run the accessibility tests manually at any time:

```bash
npm run test:a11y
```

## Troubleshooting

If the hook doesn't trigger:
1. Verify the file pattern matches your component files
2. Check that the hook is enabled in the Agent Hooks panel
3. Ensure `npm run test:a11y` works when run manually
4. Check the output panel for any error messages

## Additional Resources

- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- React Accessibility: https://react.dev/learn/accessibility

## Requirements Validated

This hook helps maintain compliance with:
- **Requirement 7.1**: Trigger accessibility validation on component file saves
- **Requirement 7.2**: Report accessibility issues with specific details
- **Requirement 7.3**: Validate color contrast ratios meet WCAG AA standards
- **Requirement 7.4**: Verify keyboard navigation functionality
- **Requirement 7.5**: Ensure screen reader compatibility
