# ATLAS Data Loading Guide

This guide explains how to fetch 12 months of historical data from each of the 10 priority NHS data sources.

## Overview

ATLAS integrates **10 priority data sources** covering 12 months of historical data:

| # | Data Source | Publisher | Update Frequency | Data Lag | API Credentials? |
|---|------------|-----------|------------------|----------|------------------|
| 1 | Organization Data Service (ODS) | NHS Digital | Weekly | 0 days | ❌ No |
| 2 | RTT Waiting Lists | NHS England | Monthly | ~35 days | ❌ No |
| 3 | A&E Performance (ECDS) | NHS England | Monthly | ~35 days | ❌ No |
| 4 | Workforce Statistics (ESR) | NHS England | Monthly | ~60 days | ❌ No |
| 5 | Mental Health (MHSDS) | NHS England | Monthly | ~60 days | ❌ No |
| 6 | SHMI (Mortality) | NHS England | Quarterly | ~180 days | ❌ No |
| 7 | Diagnostic Waiting Times | NHS England | Monthly | ~35 days | ❌ No |
| 8 | Cancer Waiting Times | NHS England | Monthly | ~45 days | ❌ No |
| 9 | Healthcare Infections (HCAI) | UKHSA | Monthly | ~30 days | ❌ No |
| 10 | ICB Hierarchy | NHS England | Quarterly | 0 days | ❌ No |

**Good news:** All 10 sources provide **public, open data** via CSV downloads or public APIs - **no registration or API keys required**.

---

## 1. Organization Data Service (ODS)

### What it provides
- NHS organization codes, names, addresses
- Organization types (Trusts, ICBs, GP Practices, etc.)
- Hierarchical relationships (parent/child organizations)
- Geographic data (postcodes, regions)

### Data source
- **API**: [https://directory.spineservices.nhs.uk/ORD/2-0-0](https://directory.spineservices.nhs.uk/ORD/2-0-0)
- **Format**: JSON REST API
- **No credentials required**

### How to fetch

```bash
# Get all acute trusts (RO157 = NHS Trust)
curl "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?Status=Active&PrimaryRoleId=RO197&Limit=1000" \
  -H "Accept: application/json"

# Get specific organization by ODS code
curl "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/RRK" \
  -H "Accept: application/json"
```

### Key endpoints
- `/organisations` - Search organizations
- `/organisations/{odsCode}` - Get specific org
- `/role-types` - List organization role types

### Loader script location
`server/scripts/loaders/ods-loader.ts`

---

## 2. RTT Waiting Lists

### What it provides
- Referral-to-Treatment waiting times
- Incomplete pathways (current waiting list)
- Completed pathways (admitted/non-admitted)
- Waiting time bands (0-18 weeks, 18+, 52+)
- By provider and specialty

### Data source
- **URL**: [NHS England RTT Statistics](https://www.england.nhs.uk/statistics/statistical-work-areas/rtt-waiting-times/)
- **Format**: CSV files published monthly
- **Direct download**: Excel files converted to CSV

### How to fetch

Data is published as monthly Excel files. Download URLs follow this pattern:

```
https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/[YEAR]/[MONTH]/[MONTH-YEAR-RTT-Data.xls]

Example for September 2026:
https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/10/September-2026-RTT-Data.xls
```

### Process
1. Download Excel file for each month (last 12 months)
2. Parse "Provider" worksheet (contains trust-level data)
3. Extract columns: Provider Code, Provider Name, Specialty Code, Treatment Function, Incomplete Pathways, >18 weeks, >52 weeks
4. Insert into `rtt_waiting_list` table

### Loader script location
`server/scripts/loaders/rtt-loader.ts`

---

## 3. A&E Performance (ECDS)

### What it provides
- A&E attendances by type (Type 1, 2, 3)
- 4-hour performance (% seen within 4 hours)
- 12-hour trolley waits
- Ambulance handover delays (30-60 min, 60+ min)

### Data source
- **URL**: [NHS England A&E Statistics](https://www.england.nhs.uk/statistics/statistical-work-areas/ae-waiting-times-and-activity/)
- **Format**: CSV/Excel monthly publications

### How to fetch

Monthly Excel files published ~5 weeks after month-end:

```
https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/[YEAR]/[MONTH]/[Attendances-Emergency-Admissions-MONTH-YEAR].xls
```

### Process
1. Download monthly file
2. Parse "Provider" sheet
3. Extract: Provider Code, Type, Attendances, >4hr breaches, 12hr waits, handover delays
4. Insert into `ae_performance` table

### Loader script location
`server/scripts/loaders/ae-loader.ts`

---

## 4. Workforce Statistics (ESR)

### What it provides
- Staff headcount and Full-Time Equivalent (FTE)
- Vacancies by staff group
- Sickness absence rates
- Turnover rates
- Bank and agency staff usage

### Data source
- **URL**: [NHS Digital Workforce Statistics](https://digital.nhs.uk/data-and-information/publications/statistical/nhs-workforce-statistics)
- **Format**: CSV files

### How to fetch

Published monthly with ~2 month lag. Download CSV from publication page.

```
Direct link format:
https://files.digital.nhs.uk/[FILE-ID]/NHS%20Workforce%20Statistics%20-%20[Month]%20[Year].csv
```

### Process
1. Download monthly CSV
2. Filter for acute trusts (Org Type = NHS Trust)
3. Extract: Org Code, Staff Group, Headcount, FTE, Vacancies, Sickness %, Turnover %
4. Insert into `workforce_monthly` table

### Loader script location
`server/scripts/loaders/workforce-loader.ts`

---

## 5. Mental Health Services Dataset (MHSDS)

### What it provides
- Mental health referrals and caseloads
- Service contacts and activity
- Out-of-area placements
- By provider and service type

### Data source
- **URL**: [NHS Digital MHSDS Publications](https://digital.nhs.uk/data-and-information/publications/statistical/mental-health-services-monthly-statistics)
- **Format**: CSV files

### How to fetch

Monthly CSV files available on publication page:

```
https://digital.nhs.uk/data-and-information/publications/statistical/mental-health-services-monthly-statistics/[latest]
```

### Process
1. Download "Provider-level activity" CSV
2. Extract: Provider, Service Type, Referrals, Open Referrals, Contacts, Caseload
3. Insert into `mental_health_activity` table

### Loader script location
`server/scripts/loaders/mhsds-loader.ts`

---

## 6. SHMI (Mortality Indicator)

### What it provides
- Quarterly mortality rates
- Observed vs expected deaths
- SHMI ratio (risk-adjusted mortality)
- Banding: Lower/As Expected/Higher

### Data source
- **URL**: [NHS Digital SHMI Publications](https://digital.nhs.uk/data-and-information/publications/statistical/shmi)
- **Format**: CSV files

### How to fetch

Quarterly publications (4 per year) with ~6 month lag:

```
https://files.digital.nhs.uk/[FILE-ID]/SHMI_[PERIOD].csv

Example:
https://files.digital.nhs.uk/.../SHMI_Apr2025_Mar2026.csv
```

### Process
1. Download quarterly CSV
2. Extract: Provider Code, Period Start, Period End, Observed Deaths, Expected Deaths, SHMI Ratio, Banding
3. Insert into `shmi_mortality` table

### Loader script location
`server/scripts/loaders/shmi-loader.ts`

---

## 7. Diagnostic Waiting Times (DM01)

### What it provides
- Waiting times for 15 key diagnostic tests
- Tests: MRI, CT, Non-obstetric ultrasound, DEXA scan, Audiology, Cardiology, Neurophysiology, Respiratory, Sleep studies, Colonoscopy, Flexi sigmoidoscopy, Cystoscopy, Gastroscopy
- 6-week wait standard
- Activity volumes

### Data source
- **URL**: [NHS England Diagnostics Statistics](https://www.england.nhs.uk/statistics/statistical-work-areas/diagnostics-waiting-times-and-activity/)
- **Format**: CSV/Excel monthly

### How to fetch

Monthly Excel files:

```
https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/[YEAR]/[MONTH]/[Diagnostics-MONTH-YEAR].xls
```

### Process
1. Download monthly Excel
2. Parse provider-level sheet
3. Extract: Provider, Test Type, Total Waiting, Waiting >6 weeks, Activity performed
4. Insert into `diagnostic_waiting` table

### Loader script location
`server/scripts/loaders/diagnostics-loader.ts`

---

## 8. Cancer Waiting Times

### What it provides
- 2-week wait (urgent GP referral to first appointment)
- 31-day standard (diagnosis to treatment)
- 62-day standard (urgent referral to treatment)
- 28-day Faster Diagnosis Standard
- By cancer type and provider

### Data source
- **URL**: [NHS England Cancer Statistics](https://www.england.nhs.uk/statistics/statistical-work-areas/cancer-waiting-times/)
- **Format**: CSV/Excel monthly

### How to fetch

Monthly Excel files:

```
https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/[YEAR]/[MONTH]/[Cancer-Waiting-Times-MONTH-YEAR].xls
```

### Process
1. Download monthly Excel
2. Parse provider sheet
3. Extract: Provider, Cancer Type, 2WW referrals/seen, 31-day referrals/treated, 62-day referrals/treated
4. Insert into `cancer_waiting` table

### Loader script location
`server/scripts/loaders/cancer-loader.ts`

---

## 9. Healthcare Associated Infections (HCAI)

### What it provides
- MRSA bacteremia
- MSSA bacteremia
- Clostridioides difficile infections
- E. coli bloodstream infections
- Klebsiella and other Gram-negatives
- Trust-apportioned vs third-party cases

### Data source
- **URL**: [UKHSA Fingertips AMR](https://fingertips.phe.org.uk/profile/amr-local-indicators)
- **API**: [Fingertips API](https://fingertips.phe.org.uk/api)
- **Format**: JSON API (no credentials required)

### How to fetch

```bash
# Get HCAI data via Fingertips API
curl "https://fingertips.phe.org.uk/api/all_data/csv/by_indicator_id?indicator_ids=90808,90809&parent_area_type_id=6&child_area_type_id=118" \
  -H "Accept: application/json"
```

**Indicator IDs:**
- `90808` = MRSA bacteremia
- `90809` = MSSA bacteremia
- `90810` = C. difficile
- `90818` = E. coli bloodstream infections

### Process
1. Fetch from Fingertips API for each infection type
2. Filter by NHS Trust area type (area_type_id = 118)
3. Extract last 12 months of monthly data
4. Insert into `hcai_infections` table

### Loader script location
`server/scripts/loaders/hcai-loader.ts`

---

## 10. ICB Hierarchy

### What it provides
- Integrated Care Board (ICB) codes and names
- Sub-ICB Location (SICBL) mappings
- NHS England regional structure
- Geographic groupings for reporting

### Data source
- **URL**: [NHS England ICB Information](https://www.england.nhs.uk/publication/integrated-care-boards/)
- **Format**: CSV or manual JSON mapping

### How to fetch

Static reference data (updates quarterly). Can be maintained as JSON fixture:

```json
{
  "regions": [
    {
      "code": "Y56",
      "name": "Midlands",
      "icbs": [
        { "code": "QWE", "name": "Birmingham and Solihull ICB" }
      ]
    }
  ]
}
```

Alternatively, extract from ODS API using ICB role types.

### Process
1. Fetch ICB organizations from ODS (role type = ICB)
2. Map to NHS England regions
3. Insert into `icb_hierarchy` table

### Loader script location
`server/scripts/loaders/icb-loader.ts`

---

## Running Data Loaders

### 1. Set up database

```bash
# Generate migrations from schema
npm run db:generate

# Apply migrations
npm run db:push

# Seed reference data (users + data source registry)
npm run db:seed
```

### 2. Load all data

```bash
# Run all loaders (12 months of data from all 10 sources)
npm run data:load-all
```

### 3. Load individual sources

```bash
npm run data:load-orgs        # ODS organizations
npm run data:load-rtt         # RTT waiting lists
npm run data:load-ae          # A&E performance
npm run data:load-workforce   # Workforce statistics
npm run data:load-mhsds       # Mental health
npm run data:load-shmi        # Mortality
npm run data:load-diagnostics # Diagnostic waits
npm run data:load-cancer      # Cancer waits
npm run data:load-hcai        # Infections
npm run data:load-icb         # ICB hierarchy
```

---

## Data Refresh Strategy

### Automated Schedule

Configure cron jobs or scheduled tasks to refresh data based on publication frequency:

| Source | Frequency | Suggested Schedule |
|--------|-----------|-------------------|
| ODS | Weekly | Every Monday 9am |
| RTT, A&E, Diagnostics, Cancer | Monthly | 1st of month (check for new publication) |
| Workforce, MHSDS | Monthly | 5th of month (longer lag) |
| SHMI | Quarterly | Check quarterly |
| HCAI | Monthly | Weekly (data updated frequently) |
| ICB | Quarterly | Check quarterly |

### Implementation

Use Cloudflare Workers Cron Triggers (when hosted) or local cron:

```typescript
// Example: Scheduled data refresh
export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Check for new data and load if available
    await checkAndLoadNewData('rtt')
    await checkAndLoadNewData('ae')
  },
}
```

---

## Storage Estimates

Approximate database size for **12 months of data**:

| Source | Estimated Rows | Storage |
|--------|----------------|---------|
| Organizations | 20,000 | 10 MB |
| ICB Hierarchy | 1,000 | 0.5 MB |
| RTT Waiting Lists | 2.4M | 500 MB |
| A&E Performance | 60,000 | 50 MB |
| Workforce | 600,000 | 150 MB |
| Mental Health | 120,000 | 80 MB |
| SHMI | 4,000 | 2 MB |
| Diagnostics | 240,000 | 100 MB |
| Cancer | 180,000 | 90 MB |
| HCAI | 48,000 | 20 MB |
| **Total** | **~3.7M rows** | **~1 GB** |

SQLite handles this efficiently. With indexes, expect ~1.5 GB total database size.

---

## Troubleshooting

### Issue: Excel file download fails

**Solution:** NHS England occasionally changes file URLs. Check the publication page manually and update the URL pattern in the loader script.

### Issue: Data parsing errors

**Solution:** NHS Excel formats sometimes change (extra header rows, renamed columns). Update the parser in the loader to handle the new format.

### Issue: Rate limiting

**Solution:** Add delays between requests. ODS API and Fingertips are generally lenient, but add 100-500ms delays to be respectful.

### Issue: Missing historical data

**Solution:** Older publications may be archived. Check NHS England archive pages or contact NHS Digital for historical data exports.

---

## Next Steps

1. ✅ Review this guide
2. ⏳ Implement loader scripts in `server/scripts/loaders/`
3. ⏳ Test each loader individually
4. ⏳ Run full 12-month data load
5. ⏳ Build dashboard UI to visualize loaded data
6. ⏳ Deploy to Cloudflare with automated refresh schedule

---

**Questions?** Check the [atlas-prep repository](https://github.com/tomnortonuk/atlas-prep) for full architectural documentation.
