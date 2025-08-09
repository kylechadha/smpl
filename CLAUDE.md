# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simple New Tab is a Chrome browser extension that provides a minimalist new tab page with an animated clock and customizable themes. The extension replaces the default new tab page with a clean interface showing current time, date, and a visual clock with multiple animation styles.

## Architecture

This is a simple client-side Chrome extension with no build process or backend dependencies:

- **manifest.json**: Chrome extension manifest (v3) with storage permission for cross-device sync
- **PRIVACY.md**: Privacy policy for Chrome Web Store compliance
- **smpl.html**: Main new tab page with clock display
- **popup.html**: Extension popup accessible from browser toolbar
- **js/main.js**: Core application logic for clock, theming, visualizations, and user interactions
- **css/styles.css**: Responsive styles with CSS custom properties for themes and visualizations
- **Zero dependencies**: Pure vanilla JavaScript and native APIs

## Key Features

### Theme System
- 7 predefined color themes stored in `themes` array
- Theme switching via left/right arrow key navigation  
- Current theme persisted via Chrome Storage API (syncs across devices) with localStorage fallback
- Theme changes apply CSS classes to body element
- Themes: Biscay, Sky Blue, Tangerine, Gin, Slate, Charcoal, Frost

### Visualization System
- 4 visualization modes: Classic, Rings, Dots, Smooth
- Up/down arrow navigation for visualization switching
- **Classic**: Traditional seconds sweep with 60 second markers, perfectly aligned
- **Rings**: Dual concentric rings showing minutes (outer) and seconds (inner)
- **Dots**: Granular dots with trailing effect and 5-minute markers
- **Smooth**: Ultra-smooth millisecond-precision sweep animation
- Visualization names displayed on switching
- Current visualization persisted via Chrome Storage API (syncs across devices) with localStorage fallback

### Clock Implementation
- Native JavaScript Date/Intl APIs for time formatting and display
- SVG-based circular seconds sweep animations
- Updates every second via setInterval with additional 60fps updates for smooth mode
- Stroke-dashoffset animation for smooth sweep motion
- Dynamic text sizing with canvas-based width measurement for balanced time/date display

### Responsive Design
- CSS custom properties for theme and animation control
- Responsive scaling for different screen sizes
- Maintains aspect ratio across all viewports from mobile to ultrawide monitors

### Settings Modal
- Accessible settings interface triggered by gear icon or 'S' key
- Interactive theme and visualization selection with visual previews
- Keyboard shortcut indicators showing arrow key navigation
- Modal overlay with proper focus management and ARIA attributes
- Close with Escape key or clicking outside modal

### Performance Optimization
- Hardware-accelerated animations with CSS transforms
- Disables CSS transitions when page loses focus to prevent animation glitches
- Cross-browser visibility API implementation
- Ultra-crisp text rendering for modern displays

## Development

### Development Workflow
- `npm run dev` - Start live reload server at http://localhost:8000/smpl.html
- `npm run build` - Create extension.zip for Chrome Web Store upload
- Load unpacked extension in Chrome developer mode for testing

### Visual Verification Protocol
**IMPORTANT**: Always use Playwright MCP tools to verify all visual changes before finalizing:
- Use `mcp__playwright__browser_navigate` to load the extension at `file:///Users/kychadha/projects/smpl/smpl.html`
- Take screenshots with `mcp__playwright__browser_take_screenshot` to verify clock alignment, animations, and visual consistency
- Test theme switching and visualization changes interactively with arrow keys
- Verify responsive design across different viewport sizes
- Test all 4 visualization modes (Classic, Rings, Dots, Smooth) work correctly
- Never assume changes work correctly without visual confirmation

## Commit Guidelines
- Prefer simple commit messages, 2-3 bulletpoints