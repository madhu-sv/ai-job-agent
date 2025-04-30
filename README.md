# 🚀 AI Job Agent

An AI-powered Job Search and CV Tailoring assistant built with:

- Next.js 14 (App Router, TypeScript, TailwindCSS)
- RapidAPI (JSearch API)
- OpenAI (LLM-based skill matching)

---

## 🏛 Project Structure

```
src/
  app/
    api/             # API routes (e.g., searchJobs)
      searchJobs/
        route.ts
    job-recommendations/
      page.tsx
    upload-cv/
      page.tsx
    layout.tsx
    page.tsx
  components/        # Reusable UI (JobSearchForm, JobCard)
    JobSearchForm.tsx
    JobCard.tsx
  hooks/             # Custom React hooks (optional)
  utils/             # Helper functions (optional)
  types/             # TypeScript types (optional)
public/              # Static assets
.husky/              # Git hooks
.vscode/             # VSCode settings
.github/             # GitHub Actions workflows
package.json
tsconfig.json
next.config.ts
tailwind.config.js
postcss.config.js
prettier.config.js
pnpm-lock.yaml
README.md           # You are here
```

---

## 🚀 Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/your-username/ai-job-agent.git
cd ai-job-agent
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Setup environment**

Create a `.env.local` file in the project root:

```env
RAPIDAPI_KEY=your-rapidapi-key-here
OPENAI_API_KEY=your-openai-key-here
```

4. **Run in development**

```bash
pnpm dev
```

Browse at [http://localhost:3000](http://localhost:3000).

---

## 📦 Available Scripts

| Command          | Description                |
| ---------------- | -------------------------- |
| `pnpm dev`       | Start development server   |
| `pnpm build`     | Build for production       |
| `pnpm start`     | Serve production build     |
| `pnpm lint`      | Run ESLint                 |
| `pnpm format`    | Run Prettier               |
| `pnpm typecheck` | Run TypeScript type checks |
| `pnpm test`      | Run unit tests             |

---

## ✅ Features

- Dynamic job search (`/api/searchJobs`) via JSearch API
- Filter by Full-time, Part-time, Contractor, Intern
- Client-side search form (`JobSearchForm`)
- Display results in responsive **JobCard** components
- CV upload & AI-based skill suggestions
- Save favorite jobs ⭐
- Dark & Light theme
- Husky pre-commit hooks (lint, format, typecheck)
- GitHub Actions CI (lint, format-check, typecheck)

---

## 🛠 Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **TailwindCSS** for styling
- **Prettier** for code formatting
- **ESLint** for linting
- **Jest + Testing Library** for tests
- **Husky** & **lint-staged** for pre-commit hooks
- **GitHub Actions** for CI

---

## 📄 License

MIT
