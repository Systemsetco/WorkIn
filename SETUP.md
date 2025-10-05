# Setup Guide

## Quick Start

Follow these steps to get the LinkedIn Job Time Modifier running on your machine.

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js, React, TypeScript
- Tailwind CSS and shadcn/ui components
- Testing frameworks (Vitest, Playwright)
- All UI dependencies

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Verify Installation

The app should display with:
- ✅ Clean UI with dark/light theme toggle
- ✅ URL input field
- ✅ Time preset buttons
- ✅ Slider and custom inputs
- ✅ No console errors

## Testing

### Run Unit Tests

```bash
npm test
```

Expected output: All 30+ tests should pass

### Run E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e
```

### Run E2E Tests in UI Mode

```bash
npm run test:e2e:ui
```

## Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### TypeScript Errors Before npm install

If you see TypeScript errors before running `npm install`, this is normal. They will be resolved after installation.

### Port Already in Use

If port 3000 is busy:
```bash
# Windows
$env:PORT=3001; npm run dev

# Linux/Mac
PORT=3001 npm run dev
```

### Module Not Found Errors

Clear cache and reinstall:
```bash
Remove-Item -Recurse -Force node_modules, .next
npm install
```

### Playwright Browser Issues

Reinstall Playwright browsers:
```bash
npx playwright install --with-deps
```

## Environment Variables

No environment variables are required for basic functionality. The app runs entirely client-side.

## VS Code Setup (Recommended)

Install these extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Deploy (zero config needed)

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Next.js (Netlify, Railway, etc.).

## Next Steps

1. ✅ Install dependencies
2. ✅ Run dev server
3. ✅ Test the app
4. ✅ Run tests
5. 🚀 Deploy!

## Need Help?

- Check the [README.md](./README.md) for more details
- Open an issue on GitHub
- Review the [Contributing Guide](./CONTRIBUTING.md)
