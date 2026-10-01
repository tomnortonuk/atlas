# ATLAS

**Navigate the complete picture** across population health and care.

ATLAS is a national health and care reporting platform that enables hospitals, trusts, ICBs, and system leaders to:

- **View their own data** in context
- **Compare against peers** and benchmarks
- **Explore national datasets** for strategic insight

Built with **Nuxt 3**, **Vue 3**, **Drizzle ORM**, and **SQLite** for local development and Cloudflare deployment.

---

## 🎯 Features

- **10 Priority Data Sources** covering operational, quality, workforce, and organizational dimensions
- **12 Months Historical Data** with automated refresh capability
- **Simple Authentication** (email/password)
- **Custom Views & Reports** - save, share, and publish insights
- **Organization-based Access** - view data for your trust, ICB, region, or nationally
- **Modern UI** with ATLAS brand identity (Deep Teal `#0A5C5F` + Amber `#D97E3F`)

---

## 📊 Top 10 Data Sources

| # | Data Source | Category | Publisher | Frequency |
|---|------------|----------|-----------|-----------|
| 1 | **Organization Data Service (ODS)** | Infrastructure | NHS Digital | Weekly |
| 2 | **RTT Waiting Lists** | Operational | NHS England | Monthly |
| 3 | **A&E Performance (ECDS)** | Operational | NHS England | Monthly |
| 4 | **Workforce Statistics (ESR)** | Workforce | NHS England | Monthly |
| 5 | **Mental Health (MHSDS)** | Service Line | NHS England | Monthly |
| 6 | **SHMI (Mortality)** | Quality | NHS England | Quarterly |
| 7 | **Diagnostic Waiting Times** | Operational | NHS England | Monthly |
| 8 | **Cancer Waiting Times** | Operational | NHS England | Monthly |
| 9 | **Healthcare Infections (HCAI)** | Quality | UKHSA | Monthly |
| 10 | **ICB Hierarchy** | Infrastructure | NHS England | Quarterly |

**All sources are publicly available** with no API registration required. See [`DATA-LOADING-GUIDE.md`](./DATA-LOADING-GUIDE.md) for details.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (LTS)
- **npm** or **pnpm**
- **Docker** (optional, for containerized local development)

### 1. Clone the repository

```bash
git clone https://github.com/tomnortonuk/atlas.git
cd atlas
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment

```bash
cp .env.example .env
```

Edit `.env` and set your `JWT_SECRET`:

```env
DATABASE_URL=./data/atlas.db
JWT_SECRET=change-this-secret-in-production
NODE_ENV=development
```

### 4. Initialize database

```bash
# Generate migration files from schema
npm run db:generate

# Apply migrations to SQLite database
npm run db:push

# Seed initial data (users + data source registry)
npm run db:seed
```

Default admin user:
- Email: `admin@atlas.nhs.uk`
- Password: `admin123`

### 5. Load data (optional)

Load 12 months of data from all 10 sources:

```bash
npm run data:load-all
```

Or load individual sources:

```bash
npm run data:load-orgs        # ODS organizations (required first)
npm run data:load-rtt         # RTT waiting lists
npm run data:load-ae          # A&E performance
npm run data:load-workforce   # Workforce statistics
```

See [`DATA-LOADING-GUIDE.md`](./DATA-LOADING-GUIDE.md) for comprehensive data loading instructions.

### 6. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker Setup

### Build and run with Docker Compose

```bash
docker-compose up --build
```

Access at [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
atlas/
├── assets/
│   └── css/
│       └── main.css              # Tailwind + ATLAS brand styles
├── components/                   # Vue components
├── composables/                  # Vue composables
├── pages/
│   ├── index.vue                 # Landing page
│   ├── login.vue                 # Auth page
│   └── dashboard.vue             # Main dashboard
├── server/
│   ├── api/
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── data-sources/         # Data source endpoints
│   │   └── organizations/        # Organization endpoints
│   ├── db/
│   │   ├── schema.ts             # Drizzle ORM schema (SQLite)
│   │   ├── index.ts              # Database connection
│   │   └── seed.ts               # Initial seed script
│   ├── scripts/
│   │   └── loaders/              # Data ingestion scripts (10 sources)
│   └── utils/
│       └── auth.ts               # Auth utilities (bcrypt, JWT)
├── public/
│   └── brand/                    # ATLAS brand assets (logos, icons)
├── .env.example                  # Environment template
├── nuxt.config.ts                # Nuxt 3 configuration
├── drizzle.config.ts             # Drizzle ORM configuration
├── tailwind.config.ts            # Tailwind + ATLAS brand colors
├── package.json                  # Dependencies + scripts
├── Dockerfile                    # Docker container config
├── docker-compose.yml            # Docker Compose setup
├── DATA-LOADING-GUIDE.md         # Comprehensive data loading docs
└── README.md                     # This file
```

---

## 🗄️ Database Schema

**10 core data tables** (one per source) + infrastructure tables:

- `users` - User accounts (email/password auth)
- `data_sources` - Data source registry
- `data_availability` - Track loaded data periods
- `organizations` - ODS organization registry
- `icb_hierarchy` - ICB and region mappings
- `rtt_waiting_list` - RTT waiting times
- `ae_performance` - A&E performance metrics
- `workforce_monthly` - Workforce statistics
- `mental_health_activity` - Mental health services
- `shmi_mortality` - Mortality indicators
- `diagnostic_waiting` - Diagnostic wait times
- `cancer_waiting` - Cancer wait times
- `hcai_infections` - Healthcare infections
- `user_saved_views` - Custom views and reports

See [`server/db/schema.ts`](./server/db/schema.ts) for full schema.

---

## 🔐 Authentication

Simple JWT-based authentication with email and password.

### API Endpoints

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login and get JWT token
- **GET** `/api/auth/me` - Get current user (requires `Authorization: Bearer <token>` header)

### Example: Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@atlas.nhs.uk", "password": "admin123"}'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "email": "admin@atlas.nhs.uk",
    "name": "System Administrator",
    "role": "admin"
  }
}
```

---

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (Nuxt 3) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run db:generate` | Generate Drizzle migrations from schema |
| `npm run db:push` | Apply migrations to SQLite database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run db:seed` | Seed initial data (users + data sources) |
| `npm run data:load-all` | Load 12 months of data from all 10 sources |
| `npm run data:load-orgs` | Load ODS organizations |
| `npm run data:load-rtt` | Load RTT waiting lists |
| `npm run data:load-ae` | Load A&E performance |
| `npm run data:load-workforce` | Load workforce statistics |

---

## 🎨 ATLAS Brand

**Primary Color:** Deep Teal `#0A5C5F`  
**Accent Color:** Amber `#D97E3F`  
**Fonts:** Inter (sans-serif), IBM Plex Mono (monospace)

Brand guidelines, logos, and design assets: [atlas-prep repository](https://github.com/tomnortonuk/atlas-prep)

---

## 📖 Documentation

- **[DATA-LOADING-GUIDE.md](./DATA-LOADING-GUIDE.md)** - Comprehensive data loading documentation for all 10 sources
- **[atlas-prep repository](https://github.com/tomnortonuk/atlas-prep)** - Full architectural documentation, prompt prep, brand guidelines

---

## 🚢 Deployment

### Cloudflare Pages (Recommended)

ATLAS is designed for Cloudflare Pages with D1 (SQLite edge database).

1. Push repository to GitHub
2. Connect to Cloudflare Pages
3. Configure build:
   - **Build command:** `npm run build`
   - **Output directory:** `.output/public`
4. Add environment variables:
   - `DATABASE_URL` - Cloudflare D1 binding
   - `JWT_SECRET` - Random secret key

See [Nuxt on Cloudflare](https://nuxt.com/deploy/cloudflare) for details.

### Alternative: Docker

```bash
docker build -t atlas .
docker run -p 3000:3000 -v $(pwd)/data:/app/data atlas
```

---

## 🛠️ Tech Stack

- **Framework:** [Nuxt 3](https://nuxt.com/) (Vue 3, Nitro server)
- **UI:** [Nuxt UI](https://ui.nuxt.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [SQLite](https://www.sqlite.org/) (via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3))
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Charts:** [Chart.js](https://www.chartjs.org/), [Vue ECharts](https://github.com/ecomfe/vue-echarts)
- **Auth:** bcrypt + JWT (via [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken))
- **Utilities:** [VueUse](https://vueuse.org/), [date-fns](https://date-fns.org/), [Zod](https://zod.dev/)

---

## 🤝 Contributing

This is a personal project repository. For questions or contributions, open an issue or pull request.

---

## 📄 License

Private repository. All rights reserved.

---

## 🔗 Links

- **Production Application:** (Coming soon)
- **Documentation & Prep:** [github.com/tomnortonuk/atlas-prep](https://github.com/tomnortonuk/atlas-prep)
- **Data Sources:** See [DATA-LOADING-GUIDE.md](./DATA-LOADING-GUIDE.md)

---

**Built with care for NHS population health intelligence.** 🏥📊
