# ATLAS - Implementation Status & Next Steps

## ✅ What's Been Built

### 1. **Complete Database Foundation** ✅

**File:** `server/db/schema.ts`

- ✅ User authentication table (`users`)
- ✅ Data source registry (`data_sources`)
- ✅ Data availability tracking (`data_availability`)
- ✅ All 10 data source tables:
  - Organizations (ODS)
  - ICB Hierarchy
  - RTT Waiting Lists
  - A&E Performance
  - Workforce Statistics
  - Mental Health Activity
  - SHMI Mortality
  - Diagnostic Waiting Times
  - Cancer Waiting Times
  - HCAI Infections
- ✅ User saved views (`user_saved_views`)
- ✅ TypeScript types exported for all tables

### 2. **Authentication System** ✅

**Files:**
- `server/utils/auth.ts` - JWT + bcrypt utilities
- `server/api/auth/login.post.ts` - Login endpoint
- `server/api/auth/register.post.ts` - Registration endpoint
- `server/api/auth/me.get.ts` - Current user endpoint

**Features:**
- ✅ Email/password registration
- ✅ JWT token generation (7-day expiry)
- ✅ Password hashing with bcrypt
- ✅ Auth middleware (`requireAuth`, `getUserFromEvent`)
- ✅ Protected API routes

### 3. **Database Infrastructure** ✅

**Files:**
- `server/db/index.ts` - SQLite connection via Drizzle ORM
- `server/db/seed.ts` - Seed script (admin user + data source registry)
- `drizzle.config.ts` - Drizzle ORM configuration

**Features:**
- ✅ SQLite with WAL mode for performance
- ✅ Drizzle ORM schema-first approach
- ✅ Auto-create data directory
- ✅ Seed admin user (`admin@atlas.nhs.uk` / `admin123`)
- ✅ Seed all 10 data sources metadata

### 4. **Data Loading Infrastructure** ✅

**File:** `DATA-LOADING-GUIDE.md` (comprehensive 400+ line guide)

**Covers:**
- ✅ All 10 data sources with API endpoints and download URLs
- ✅ Data format specifications (JSON, CSV, Excel)
- ✅ Example curl commands and fetch patterns
- ✅ Publication schedules and data lag estimates
- ✅ Storage size estimates (~1-1.5 GB for 12 months)
- ✅ Refresh strategy recommendations
- ✅ Troubleshooting guide

**Implemented Loaders:**
- ✅ ODS Organizations loader (`server/scripts/loaders/ods-loader.ts`)
  - Fetches NHS Trusts, ICBs, and Sub-ICB Locations
  - Handles pagination (1000 records per page)
  - Upsert logic (updates existing records)
  - Respectful rate limiting (200ms delays)

### 5. **API Endpoints** ✅

- ✅ `POST /api/auth/login` - User login
- ✅ `POST /api/auth/register` - User registration
- ✅ `GET /api/auth/me` - Get current user (requires auth)
- ✅ `GET /api/data-sources` - List all data sources (with `?active=true` filter)
- ✅ `GET /api/organizations/:code` - Get organization by ODS code

### 6. **Frontend Pages & UI** ✅

**Pages:**
- ✅ `pages/index.vue` - Landing page with hero, features, data sources, CTA
- ✅ `pages/login.vue` - Login/register form with toggle
- ✅ `pages/dashboard.vue` - Main dashboard with stats grid, data sources list, quick actions

**Styling:**
- ✅ ATLAS brand colors (Deep Teal `#0A5C5F`, Amber `#D97E3F`)
- ✅ Tailwind CSS with custom ATLAS theme (`tailwind.config.ts`)
- ✅ Inter + IBM Plex Mono fonts
- ✅ Nuxt UI components integrated
- ✅ Responsive design

### 7. **Configuration & Setup** ✅

- ✅ `nuxt.config.ts` - Nuxt 3 configuration (modules, runtimeConfig, UI theme)
- ✅ `package.json` - All dependencies + npm scripts
- ✅ `.env.example` - Environment variable template
- ✅ `.gitignore` - Excludes node_modules, .nuxt, data/*.db, etc.
- ✅ `Dockerfile` - Production Docker container
- ✅ `docker-compose.yml` - Local Docker development setup

### 8. **Documentation** ✅

- ✅ `README.md` - Comprehensive project documentation (600+ lines)
- ✅ `DATA-LOADING-GUIDE.md` - Complete data loading reference
- ✅ Quick start guide
- ✅ API documentation
- ✅ Deployment instructions (Cloudflare + Docker)
- ✅ Tech stack overview

---

## 🔨 What Needs to Be Built

### Priority 1: Complete Data Loaders (9 remaining)

**Files to create:**

1. `server/scripts/loaders/rtt-loader.ts` - RTT Waiting Lists
   - Download monthly Excel files from NHS England
   - Parse provider/specialty sheets
   - Insert into `rtt_waiting_list` table
   - Handle 12 months of historical data

2. `server/scripts/loaders/ae-loader.ts` - A&E Performance
   - Download monthly Excel files
   - Parse provider-level A&E metrics
   - Extract 4hr breaches, 12hr trolley waits, handover delays
   - Insert into `ae_performance` table

3. `server/scripts/loaders/workforce-loader.ts` - Workforce Statistics
   - Download monthly CSV from NHS Digital
   - Parse staff group, headcount, FTE, vacancies, sickness
   - Insert into `workforce_monthly` table

4. `server/scripts/loaders/mhsds-loader.ts` - Mental Health
   - Download provider-level CSV
   - Parse referrals, caseload, contacts
   - Insert into `mental_health_activity` table

5. `server/scripts/loaders/shmi-loader.ts` - SHMI Mortality
   - Download quarterly CSV
   - Parse observed/expected deaths, SHMI ratio, banding
   - Insert into `shmi_mortality` table

6. `server/scripts/loaders/diagnostics-loader.ts` - Diagnostic Waiting
   - Download monthly Excel
   - Parse test types (MRI, CT, etc.), waiting >6 weeks
   - Insert into `diagnostic_waiting` table

7. `server/scripts/loaders/cancer-loader.ts` - Cancer Waiting Times
   - Download monthly Excel
   - Parse 2WW, 31-day, 62-day standards by cancer type
   - Insert into `cancer_waiting` table

8. `server/scripts/loaders/hcai-loader.ts` - Healthcare Infections
   - Fetch from UKHSA Fingertips API
   - Parse MRSA, MSSA, C. diff, E. coli by provider
   - Insert into `hcai_infections` table

9. `server/scripts/loaders/icb-loader.ts` - ICB Hierarchy
   - Fetch ICB organizations from ODS API (or static JSON)
   - Map to NHS England regions
   - Insert into `icb_hierarchy` table

**Master loader:**
- `server/scripts/load-all-data.ts` - Orchestrates all 10 loaders sequentially

**Reference implementation:** Use `ods-loader.ts` as a template for structure, error handling, and logging patterns.

---

### Priority 2: Data Visualization & Exploration

**API Endpoints to create:**

1. `server/api/rtt/[provider].get.ts` - RTT data for a provider
2. `server/api/ae/[provider].get.ts` - A&E performance for a provider
3. `server/api/workforce/[org].get.ts` - Workforce metrics for an organization
4. `server/api/metrics/summary.get.ts` - Summary metrics for dashboard stats
5. `server/api/organizations/index.get.ts` - List organizations with filters (type, region, ICB)

**Pages to create:**

1. `pages/explore.vue` - Data exploration interface
   - Multi-select data sources
   - Filter by organization, region, ICB, date range
   - Dynamic chart rendering (Chart.js / ECharts)

2. `pages/reports.vue` - Saved reports and custom views
   - List user's saved views
   - Create/edit/delete views
   - Share views with team

3. `pages/compare.vue` - Peer comparison
   - Select organizations to compare
   - Side-by-side metrics
   - Benchmarking against regional/national averages

4. `pages/organization/[code].vue` - Organization detail page
   - Full organization profile (from ODS)
   - All available metrics for that organization
   - Time-series charts (12 months trend)

**Components to create:**

1. `components/charts/LineChart.vue` - Reusable line chart (Chart.js)
2. `components/charts/BarChart.vue` - Reusable bar chart
3. `components/charts/HeatMap.vue` - Regional heatmap (ECharts)
4. `components/layout/Navbar.vue` - Main navigation
5. `components/layout/Sidebar.vue` - Dashboard sidebar
6. `components/filters/DataSourceFilter.vue` - Multi-select data sources
7. `components/filters/OrganizationFilter.vue` - Organization picker with search
8. `components/filters/DateRangeFilter.vue` - Date range selector

---

### Priority 3: Advanced Features

**Saved Views:**
- Create `server/api/views/` endpoints for CRUD operations on `user_saved_views`
- Add "Save Current View" button to explore page
- Store filter state, chart config, selected data sources as JSON

**Export & Sharing:**
- Add CSV/Excel export for filtered data
- Add "Share View" functionality (public link generation)
- PDF report generation (for static reports)

**Automated Data Refresh:**
- Create scheduled task runner (Cloudflare Cron or Node cron)
- Check for new data publications weekly/monthly
- Auto-load new data when detected
- Send notifications when new data is available

**Admin Panel:**
- `pages/admin/` routes (require `role: 'admin'`)
- Manual data load triggers
- Data availability dashboard
- User management

---

## 🏃 Getting Started Checklist

### On Your Development Machine

When you're back at your desk, run these commands:

```bash
# 1. Clone the repository
git clone https://github.com/tomnortonuk/atlas.git
cd atlas

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env and set JWT_SECRET to a random string

# 4. Initialize database
npm run db:generate
npm run db:push
npm run db:seed

# 5. Load ODS organizations (required first - provides org lookup)
npm run data:load-orgs

# 6. Start development server
npm run dev

# 7. Open browser
# http://localhost:3000
# Login: admin@atlas.nhs.uk / admin123
```

**Expected outcome:**
- ✅ Landing page loads with ATLAS branding
- ✅ Login page accepts admin credentials
- ✅ Dashboard shows 10 data sources in "Available Data Sources" section
- ✅ Database has organizations loaded (check with `npm run db:studio`)

---

## 📊 Implementation Priority Order

### Phase 1: Foundation (✅ COMPLETE)
- ✅ Database schema
- ✅ Authentication
- ✅ Basic UI (landing, login, dashboard)
- ✅ ODS loader
- ✅ Comprehensive documentation

### Phase 2: Data Ingestion (NEXT)
1. Implement remaining 9 data loaders (1-2 days per loader for testing)
2. Create `load-all-data.ts` master script
3. Load 12 months of historical data (~4-8 hours runtime)
4. Verify data quality with database queries

### Phase 3: Data Access API (AFTER PHASE 2)
1. Build API endpoints for each data source
2. Add filtering, pagination, aggregation
3. Create summary/metrics endpoints for dashboard

### Phase 4: Visualization & Exploration (AFTER PHASE 3)
1. Build explore page with dynamic charts
2. Implement comparison page
3. Create organization detail pages
4. Add interactive filters and controls

### Phase 5: Advanced Features (FINAL)
1. Saved views and custom reports
2. Export functionality
3. Automated refresh scheduling
4. Admin panel

---

## 🔗 Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `server/db/schema.ts` | Complete database schema | ✅ Complete |
| `server/db/seed.ts` | Database seeding | ✅ Complete |
| `server/utils/auth.ts` | Auth utilities | ✅ Complete |
| `server/scripts/loaders/ods-loader.ts` | ODS data loader | ✅ Complete |
| `DATA-LOADING-GUIDE.md` | Data loading reference | ✅ Complete |
| `README.md` | Main documentation | ✅ Complete |
| `server/scripts/loaders/rtt-loader.ts` | RTT data loader | ⏳ To implement |
| `server/scripts/loaders/ae-loader.ts` | A&E data loader | ⏳ To implement |
| `server/scripts/loaders/workforce-loader.ts` | Workforce loader | ⏳ To implement |
| `server/scripts/load-all-data.ts` | Master loader script | ⏳ To implement |
| `pages/explore.vue` | Data exploration UI | ⏳ To implement |
| `pages/reports.vue` | Saved reports UI | ⏳ To implement |

---

## 💡 Development Tips

### Testing Data Loaders

Each loader should:
1. Accept CLI arguments for date range (e.g., `--from=2025-10 --to=2026-09`)
2. Log progress clearly (which month/file being processed)
3. Handle errors gracefully (skip bad records, log errors, continue)
4. Track loaded data in `data_availability` table
5. Support re-running (upsert logic, not strict inserts)

### Example Loader Pattern

```typescript
export async function loadRTTData(fromPeriod: string, toPeriod: string) {
  console.log(`📊 Loading RTT data from ${fromPeriod} to ${toPeriod}...`)
  
  const periods = generateMonthlyPeriods(fromPeriod, toPeriod)
  
  for (const period of periods) {
    console.log(`  Processing ${period}...`)
    
    try {
      const data = await fetchRTTData(period)
      await insertRTTData(data, period)
      await trackDataAvailability('rtt', period, 'success', data.length)
      console.log(`  ✅ Loaded ${data.length} records for ${period}`)
    } catch (error) {
      console.error(`  ❌ Failed to load ${period}:`, error)
      await trackDataAvailability('rtt', period, 'failed', 0, error.message)
    }
  }
}
```

### Database Tips

```bash
# Open Drizzle Studio (web-based DB GUI)
npm run db:studio

# Query data from CLI
sqlite3 data/atlas.db "SELECT COUNT(*) FROM organizations"

# Check loaded data availability
sqlite3 data/atlas.db "SELECT * FROM data_availability"
```

### UI Development

Use Nuxt UI components for consistency:
- `<UButton>`, `<UInput>`, `<UCard>`, `<UTable>`
- `<USelect>`, `<UModal>`, `<UAlert>`
- Documentation: https://ui.nuxt.com/

---

## 🚀 Deployment Preparation

Before deploying to Cloudflare:

1. ✅ Test locally with `npm run build && npm run preview`
2. ✅ Load full 12 months of data on local SQLite
3. ✅ Export data from SQLite, import to Cloudflare D1
4. ✅ Set environment variables in Cloudflare dashboard
5. ✅ Test authentication flow end-to-end
6. ✅ Configure Cloudflare Cron for automated refresh

---

## 📚 Additional Resources

- **atlas-prep repository:** Full architectural documentation, brand guidelines, prompt preparation
- **Nuxt 3 Docs:** https://nuxt.com/docs
- **Drizzle ORM Docs:** https://orm.drizzle.team/docs/overview
- **Nuxt UI Components:** https://ui.nuxt.com/
- **NHS Data Sources:** See `DATA-LOADING-GUIDE.md`

---

## 🎯 Success Criteria

**Phase 2 Complete When:**
- ✅ All 10 data loaders implemented and tested
- ✅ 12 months of data loaded successfully
- ✅ Database size ~1-1.5 GB
- ✅ Data availability table shows 100% coverage for last 12 months

**Phase 3 Complete When:**
- ✅ API endpoints return data for all 10 sources
- ✅ Dashboard stats show real metrics (not "---")
- ✅ Organization search works
- ✅ API performance acceptable (<500ms response times)

**Phase 4 Complete When:**
- ✅ Explore page renders charts for all data sources
- ✅ Filters work (organization, date range, data source)
- ✅ Comparison page shows side-by-side metrics
- ✅ Organization detail pages show 12-month trends

**Phase 5 Complete When:**
- ✅ Users can save custom views
- ✅ Export to CSV/Excel works
- ✅ Data refresh runs automatically
- ✅ Admin panel allows manual data management

---

**Next immediate task:** Implement the remaining 9 data loaders, starting with RTT and A&E (highest priority operational metrics).

**Questions?** Review `README.md` and `DATA-LOADING-GUIDE.md` for detailed implementation guidance.

---

**Built and ready for development!** 🚀
