# WorkIn - Work in smarter, not later

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Systemsetco/WorkIn)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A clean, accessible Next.js app that generates LinkedIn job search URLs from your filter preferences. No need to paste URLs - just select your criteria and get a ready-to-use link!

---

<div align="center">
  <p>Brought to you by</p>
  <a href="https://systemset.co" target="_blank">
    <img src="https://ibb.co/5Wfxckm0" alt="systemset.co" width="200" />
  </a>
</div>

---

A clean, accessible Next.js app that generates LinkedIn job search URLs from your filter preferences. No need to paste URLs - just select your criteria and get a ready-to-use link!

## Features

- ✨ **Smart Filter Form** - Build URLs from scratch with intuitive filters
- 🎯 **Comprehensive Filters** - Job type, work mode, experience level, location, and more
- ⏰ **Time Presets** - 1h, 2h, 6h, 12h, 24h, 3d, 7d
- 📋 **Copy/Share** - Easy clipboard copy and direct LinkedIn opening
- ✅ **Validation** - Smart field validation with helpful error messages
- 🌓 **Dark Mode** - Full theme toggle support
- ♿ **Accessible** - WCAG compliant with ARIA labels and keyboard support
- 📱 **Responsive** - Mobile-first design
- 🧪 **Well Tested** - Unit and E2E tests with comprehensive coverage

## How It Works

Select your job search preferences and the app builds a complete LinkedIn URL:

**Your Selections:**
- Designation: Software Engineer
- Location: San Francisco, Calirfornia
- Job Type: Full-time
- Work Mode: Remote
- Experience: Entry Level
- Posted: Last 1 hour

**Generated URL:**
```
https://www.linkedin.com/jobs/search/?keywords=Software+Engineer&location=Karachi&f_WT=1&f_WRA=1&f_E=2&f_TPR=r3600
```

### LinkedIn Parameters

| Parameter | Description | Values |
|-----------|-------------|--------|
| `keywords` | Job title/designation | Any text |
| `location` | City/Country | Any location |
| `f_TPR` | Time posted | `r3600` (1h), `r86400` (24h), etc. |
| `f_WT` | Job type | 1=Full-time, 2=Part-time, 3=Contract, 4=Temporary, 5=Internship, 6=Volunteer |
| `f_WRA` | Work arrangement | 1=Remote, 2=On-site, 3=Hybrid |
| `f_E` | Experience level | 1=Internship, 2=Entry, 3=Associate, 4=Mid-Senior, 5=Director, 6=Executive |
| `sortBy` | Sort order | DD=Recent, R=Relevance |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git

### Clone the Repository

```bash
git clone https://github.com/Systemsetco/WorkIn.git
cd WorkIn
```

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/) 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Systemsetco/WorkIn.git
cd WorkIn

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Enter Job Details** - Type your desired job designation (e.g., "Python Developer")
2. **Add Location** (Optional) - Specify city or country (e.g., "Karachi, Pakistan")
3. **Select Filters** - Choose job type, work mode, experience level
4. **Pick Time Range** - Select when jobs were posted (1h, 24h, 7d, etc.)
5. **Generate Link** - Click to create your LinkedIn job search URL
6. **Copy or Open** - Use the generated link immediately or copy for later

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests with Vitest
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests in UI mode

## Testing

### Unit Tests

```bash
npm test
```

Tests cover:
- URL building logic with all filter combinations
- Parameter validation
- Edge cases (empty fields, special characters, arrays, etc.)
- Filter validation functions
- Time formatting and summaries

### E2E Tests

```bash
npm run test:e2e
```

Tests cover:
- Full user workflows
- Accessibility (axe-core)
- Keyboard navigation
- Mobile responsiveness
- Theme toggling
- Clipboard operations

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Theme:** next-themes
- **Testing:** Vitest + Playwright + axe-core
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel (recommended)

## Project Structure

```
├── app/
│   ├── layout.tsx                    # Root layout with theme provider
│   ├── page.tsx                      # Main app component (filter form)
│   └── globals.css                   # Global styles
├── components/
│   ├── ui/                           # shadcn/ui components
│   └── theme-provider.tsx            # Theme context provider
├── lib/
│   ├── utils.ts                      # Utility functions (cn)
│   └── linkedin-url-builder.ts       # URL building logic
├── hooks/
│   └── use-toast.ts                  # Toast notification hook
├── __tests__/
│   └── linkedin-url-builder.test.ts  # Unit tests
├── e2e/
│   └── app.spec.ts                   # E2E tests
└── public/                           # Static assets
```

## URL Building Logic

The core function (`buildLinkedInJobURL`) handles:

- ✅ Building URLs from scratch with selected filters
- ✅ Setting keywords (required field)
- ✅ Adding optional location
- ✅ Setting time filter (`f_TPR`)
- ✅ Setting job type (`f_WT`)
- ✅ Setting work arrangement (`f_WRA`)
- ✅ Setting experience level (`f_E`)
- ✅ Setting sort order (`sortBy`)
- ✅ URL encoding special characters
- ✅ Supporting multiple values (arrays) for filters
- ✅ Validation with helpful error messages

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import repository in Vercel
3. Deploy (zero configuration needed)

### Manual Deployment

```bash
npm run build
# Deploy the .next folder to your hosting provider
```

## Privacy & LinkedIn ToS

- **No Data Storage:** All operations happen client-side
- **No Scraping:** Only generates URLs, doesn't access LinkedIn data
- **No API Calls:** Pure client-side JavaScript
- **Respects ToS:** Users are responsible for LinkedIn's Terms of Service
- **No Login Required:** Works without any authentication

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Version:** 2.0.0 - WorkIn - Work in smarter, not later

**Note:** This tool is not affiliated with or endorsed by LinkedIn. It simply generates search URLs based on your preferences. Use responsibly and respect LinkedIn's Terms of Service.
