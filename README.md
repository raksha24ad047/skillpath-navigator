# SkillPath Navigator 🎯

### Your Roadmap to Career Readiness

SkillPath Navigator is a career-readiness and skill-development platform designed to help students and aspiring software developers identify skill gaps, explore learning opportunities, and prepare for their target roles in the technology industry.

The project brings together skill-gap analysis, career roadmaps, interview preparation, resume optimization concepts, and industry insights in one place.

## 📌 Problem Statement

Students and aspiring developers often struggle to understand which technical skills they need for their desired roles, what they should learn next, and how to prepare for industry expectations.

Learning resources are scattered across different platforms, making it difficult to prioritize skills and track career readiness.

SkillPath Navigator aims to address this challenge by providing a centralized interface for exploring skill gaps, organizing learning priorities, and preparing for technical careers.

## ✨ Key Features

### 1. AI Skill Gap Analyzer
- Explore skill requirements for selected technical career paths.
- Identify potential gaps between existing skills and target-role expectations.
- View skill categories and industry-related insights.
- Includes a sample-data fallback for demonstrating skill-gap information.

### 2. Dynamic Learning Roadmap
- Explore a structured approach to career preparation.
- Organize learning priorities into manageable steps.
- Discover relevant learning topics and resources.

### 3. Resume Optimization
- Includes an interface for exploring resume optimization and ATS-readiness concepts.
- Designed to support better alignment between resumes and target job roles.

### 4. Mock Interview Simulation
- Includes a feature interface for practicing interview scenarios.
- Intended to help users prepare for technical interviews.

### 5. Company Cheat Sheets
- Explore company-related preparation information.
- Review career and interview preparation insights for different organizations.

### 6. Industry Skill Insights
- Visualize market-related skill information.
- Explore trending skills and industry-demand indicators.

### 7. Authentication
- Includes an authentication interface with email/password and Google sign-in options.
- Uses Supabase-related authentication integration.

> **Note:** The repository contains a combination of implemented interfaces, sample data, and features at different stages of development. The presence of a feature in the interface does not necessarily mean its complete backend functionality is implemented.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| TypeScript | Type-safe application development |
| TanStack Start | Application routing and full-stack framework |
| TanStack Router | File-based routing |
| Vite | Development server and build tooling |
| Tailwind CSS | Styling and responsive layouts |
| shadcn/ui and Radix UI | Reusable interface components |
| Lucide React | Icons |
| Recharts | Data visualization components |
| Supabase | Authentication and backend integration |
| Cloudflare tooling | Application deployment configuration |
| Git and GitHub | Version control and source-code management |

## 🏗️ Project Structure

```text
skillpath-navigator/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Brand.tsx
│   │   ├── CompanyCheatSheet.tsx
│   │   ├── FeatureDialog.tsx
│   │   ├── MarketHeatmap.tsx
│   │   ├── ReadinessScore.tsx
│   │   ├── SiteNav.tsx
│   │   └── SkillGapPanel.tsx
│   ├── hooks/               # Reusable React hooks
│   ├── integrations/        # External service integrations
│   │   ├── lovable/
│   │   └── supabase/
│   ├── lib/                 # Shared utilities and data
│   ├── routes/              # Application pages
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── auth.tsx
│   │   └── dashboard.tsx
│   ├── server.ts            # Server entry point
│   └── styles.css           # Global styles
├── supabase/
│   └── migrations/          # Database migration files
├── .gitignore
├── package.json
├── vite.config.ts
├── wrangler.jsonc
└── README.md
```

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm, which is included with Node.js
- Git

### 1. Clone the repository

Replace `YOUR_USERNAME` with your GitHub username.

```bash
git clone https://github.com/YOUR_USERNAME/skillpath-navigator.git
```

### 2. Navigate to the project directory

```bash
cd skillpath-navigator
```

If your GitHub repository has a different name, use that name in the command.

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a local `.env` file in the project root.

Add the environment variable names required by the application:

```env
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_URL=your_supabase_project_url
```

Replace the placeholders with the appropriate values from your Supabase project.

Do not commit your `.env` file or expose private credentials in your repository.

Some features may require additional service configuration before they work correctly.

### 5. Start the development server

```bash
npm run dev
```

Open the local address printed in your terminal to view the application.

### 6. Build the application

To check whether the project builds successfully, run:

```bash
npm run build
```

The project uses TanStack Start and Vite, so its production output and deployment requirements differ from those of a basic static HTML website.

## 📊 Current Project Status

- [x] Initial application interface
- [x] Landing page
- [x] Dashboard interface
- [x] Authentication page
- [x] Skill-gap analysis interface
- [x] Career preparation feature interfaces
- [x] Supabase integration structure
- [ ] Complete and verify all feature workflows
- [ ] Validate authentication and backend functionality
- [ ] Expand personalized learning recommendations
- [ ] Test the application end to end
- [ ] Complete deployment configuration

*The checklist describes the current intended development scope. Individual features should be tested before being marked as fully functional.*

## 🔮 Future Enhancements

Potential improvements include:

- Personalized learning recommendations based on diagnostic assessments.
- More detailed career roadmaps for different technical roles.
- Resume analysis and actionable feedback.
- Interactive technical mock interviews.
- Progress tracking and learning milestones.
- Integration with verified learning resources.
- More comprehensive industry skill-demand insights.
- Automated testing and improved error handling.
- A fully tested, production-ready deployment workflow.

## 🎯 Project Objective

The goal of SkillPath Navigator is to make career preparation more structured and accessible by helping learners understand what they know, identify what they need to learn, and plan their next steps toward technical career opportunities.

## 👩‍💻 Development Approach

This project was developed using an AI-assisted development workflow with Lovable, alongside a modern React and TypeScript technology stack.

The project can be further improved through code review, feature validation, testing, and iterative development.

## 📄 License

No license has been specified yet.

If you intend to allow others to reuse, modify, or distribute this project, consider adding an appropriate open-source license.

---

**Built with a focus on learning, career readiness, and continuous improvement.** 🚀

