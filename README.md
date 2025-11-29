# Base.Tube Website

The official website for Base.Tube - The Platform That Pays Creators First.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Custom CSS
- **CMS**: WordPress (Headless)
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

## Getting Started

```bash
cd blog-nextjs
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
blog-nextjs/
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── blog/      # Blog listing & posts
│   │   ├── landing/   # Landing page
│   │   ├── roadmap/   # Roadmap page
│   │   └── ...
│   ├── components/    # React components
│   │   ├── landing/   # Landing page sections
│   │   ├── seo/       # SEO structured data
│   │   └── ui/        # Reusable UI components
│   └── lib/           # Utilities & WordPress API
├── public/            # Static assets
└── ...
```

## SEO Features

- ✅ Dynamic sitemap with all blog posts
- ✅ JSON-LD structured data (Article, Organization, BreadcrumbList)
- ✅ RSS feed at `/feed.xml`
- ✅ Open Graph & Twitter Cards
- ✅ Dynamic meta tags per post
- ✅ Canonical URLs

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WP_API_URL=https://wp.base.tube/wp-json/wp/v2
```

## Links

- **Website**: [https://base.tube](https://base.tube)
- **Beta**: [https://beta.base.tube](https://beta.base.tube)
- **Docs**: [https://base-tube.gitbook.io](https://base-tube.gitbook.io/base.tube-documentation)
