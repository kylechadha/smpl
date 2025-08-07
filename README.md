# Simple New Tab

A minimalist Chrome browser extension that replaces your new tab page with a clean, animated clock interface.

## Features

- **Animated Clock**: SVG-based circular clock with smooth seconds sweep animation
- **11 Color Themes**: Navigate themes with left/right arrow keys
- **Dynamic Text Sizing**: Automatically balances time and date text for optimal visual weight
- **Responsive Design**: Adapts to all screen sizes from mobile to ultrawide monitors
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance Optimized**: Hardware-accelerated animations and modern rendering

## Themes

Cycle through 11 beautiful color themes using the left and right arrow keys:
- Biscay, Periwinkle, Atomic Tangerine, Gin, Interdimensional Blue
- Jazzberry Jam, Tolopea White, Sky Blue, Tolopea, Minimal, Minimal Night

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build extension for Chrome Web Store
npm run build
```

Load the unpacked extension in Chrome developer mode for testing.

## Architecture

- **No build process**: Simple client-side extension
- **Modern web standards**: Uses CSS custom properties, SVG animations
- **Lightweight**: Optimized for fast loading and smooth performance

Created with ❤️ by Kyle Chadha