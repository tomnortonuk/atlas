/**
 * ATLAS Database Schema - Nuxt 3 + Drizzle ORM
 * 
 * Top 10 Priority Data Sources:
 * 1. Organizations (ODS)
 * 2. RTT Waiting Lists
 * 3. A&E Performance (ECDS)
 * 4. Workforce (ESR)
 * 5. Mental Health (MHSDS)
 * 6. SHMI (Mortality)
 * 7. Diagnostic Waiting Times
 * 8. Cancer Waiting Times
 * 9. HCAI (Infections)
 * 10. ICB Hierarchy
 * 
 * Data Period: Last 12 months
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// ============================================================================
// AUTHENTICATION & USERS
// ============================================================================

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  organizationOds: text('organization_ods'),
  role: text('role').default('user'), // 'admin', 'user'
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  lastLogin: text('last_login'),
})

// ============================================================================
// DATA SOURCE MANAGEMENT
// ============================================================================

export const dataSources = sqliteTable('data_sources', {
  sourceId: text('source_id').primaryKey(),
  sourceName: text('source_name').notNull(),
  sourceDescription: text('source_description'),
  sourceCategory: text('source_category'),
  publisher: text('publisher'),
  updateFrequency: text('update_frequency'),
  typicalLagDays: integer('typical_lag_days'),
  endpointUrl: text('endpoint_url'),
  apiCredentialsRequired: integer('api_credentials_required', { mode: 'boolean' }).default(false),
  credentialsGuideUrl: text('credentials_guide_url'),
  granularity: text('granularity'),
  active: integer('active', { mode: 'boolean' }).default(true),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const dataAvailability = sqliteTable('data_availability', {
  availabilityId: integer('availability_id').primaryKey({ autoIncrement: true }),
  sourceId: text('source_id').notNull().references(() => dataSources.sourceId),
  reportingPeriodStart: text('reporting_period_start').notNull(),
  reportingPeriodEnd: text('reporting_period_end').notNull(),
  publicationDate: text('publication_date'),
  loadedDate: text('loaded_date'),
  loadStatus: text('load_status').default('pending'),
  recordCount: integer('record_count'),
  errorMessage: text('error_message'),
})

// ============================================================================
// 1. ORGANIZATIONS (ODS)
// ============================================================================

export const organizations = sqliteTable('organizations', {
  odsCode: text('ods_code').primaryKey(),
  organizationName: text('organization_name').notNull(),
  organizationType: text('organization_type').notNull(),
  subType: text('sub_type'),
  status: text('status').default('Active'),
  openDate: text('open_date'),
  closeDate: text('close_date'),
  addressLine1: text('address_line1'),
  city: text('city'),
  postcode: text('postcode'),
  regionCode: text('region_code'),
  regionName: text('region_name'),
  icbCode: text('icb_code'),
  parentOdsCode: text('parent_ods_code'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  lastUpdated: text('last_updated'),
})

// ============================================================================
// 10. ICB HIERARCHY
// ============================================================================

export const icbHierarchy = sqliteTable('icb_hierarchy', {
  hierarchyId: integer('hierarchy_id').primaryKey({ autoIncrement: true }),
  sicblCode: text('sicbl_code'),
  sicblName: text('sicbl_name'),
  icbCode: text('icb_code').notNull(),
  icbName: text('icb_name').notNull(),
  regionCode: text('region_code').notNull(),
  regionName: text('region_name').notNull(),
})

// ============================================================================
// 2. RTT WAITING LISTS
// ============================================================================

export const rttWaitingList = sqliteTable('rtt_waiting_list', {
  recordId: integer('record_id').primaryKey({ autoIncrement: true }),
  reportingPeriod: text('reporting_period').notNull(), // YYYY-MM
  providerOdsCode: text('provider_ods_code').notNull(),
  specialtyCode: text('specialty_code').notNull(),
  specialtyName: text('specialty_name'),
  pathwayType: text('pathway_type'), // Admitted, Non-Admitted, Incomplete
  weeksWaitingBand: text('weeks_waiting_band'), // 0-1, 1-2, ... 52+
  patientCount: integer('patient_count').notNull(),
})

// ============================================================================
// 3. A&E PERFORMANCE (ECDS/MSitAE)
// ============================================================================

export const aePerformance = sqliteTable('ae_performance', {
  recordId: integer('record_id').primaryKey({ autoIncrement: true }),
  reportingPeriod: text('reporting_period').notNull(),
  providerOdsCode: text('provider_ods_code').notNull(),
  departmentType: text('department_type'), // Type 1, Type 2, Type 3
  totalAttendances: integer('total_attendances'),
  attendances4hrBreaches: integer('attendances_4hr_breaches'),
  attendances12hrTrolley: integer('attendances_12hr_trolley'),
  ambulanceHandover30to60: integer('ambulance_handover_30_to_60'),
  ambulanceHandoverOver60: integer('ambulance_handover_over_60'),
})

// ============================================================================
// 4. WORKFORCE (ESR)
// ============================================================================

export const workforceMonthly = sqliteTable('workforce_monthly', {
  recordId: integer('record_id').primaryKey({ autoIncrement: true }),
  reportingPeriod: text('reporting_period').notNull(),
  orgOdsCode: text('org_ods_code').notNull(),
  staffGroup: text('staff_group').notNull(), // Nursing, Medical, AHP, etc.
  occupationCode: text('occupation_code'),
  headcount: integer('headcount'),
  fte: real('fte'),
  vacanciesFte: real('vacancies_fte'),
  sicknessAbsenceRate: real('sickness_absence_rate'),
  turnoverRate: real('turnover_rate'),
  bankStaffFte: real('bank_staff_fte'),
  agencyStaffFte: real('agency_staff_fte'),
})

// ============================================================================
// 5. MENTAL HEALTH (MHSDS)
// ============================================================================

export const mentalHealthActivity = sqliteTable('mental_health_activity', {
  recordId: integer('record_id').primaryKey({ autoIncrement: true }),
  reportingPeriod: text('reporting_period').notNull(),
  providerOdsCode: text('provider_ods_code').notNull(),
  serviceType: text('service_type'), // Community, Inpatient, IAPT, CYP
  referrals: integer('referrals'),
  openReferrals: integer('open_referrals'),
  discharges: integer('discharges'),
  contacts: integer('contacts'),
  caseloadCount: integer('caseload_count'),
})

// ============================================================================
// 6. SHMI (MORTALITY)
// ============================================================================

export const shmiMortality = sqliteTable('shmi_mortality', {
  recordId: integer('record_id').primaryKey({ autoIncrement: true }),
  reportingPeriodStart: text('reporting_period_start').notNull(),
  reportingPeriodEnd: text('reporting_period_end').notNull(),
  providerOdsCode: text('provider_ods_code').notNull(),
  diagnosisGroup: text('diagnosis_group'), // 'All' or specific condition
  observedDeaths: integer('observed_deaths'),
  expectedDeaths: real('expected_deaths'),
  shmiRatio: real('shmi_ratio'),
  shmiBanding: text('shmi_banding'), // Lower, As expected, Higher
})

// ============================================================================
// 7. DIAGNOSTIC WAITING TIMES (DM01)
// ============================================================================

export const diagnosticWaiting = sqliteTable('diagnostic_waiting', {
  recordId: integer('record_id').primaryKey({ autoIncrement: true }),
  reportingPeriod: text('reporting_period').notNull(),
  providerOdsCode: text('provider_ods_code').notNull(),
  diagnosticTest: text('diagnostic_test').notNull(), // MRI, CT, Colonoscopy, etc.
  totalWaiting: integer('total_waiting'),
  waitingOver6Weeks: integer('waiting_over_6_weeks'),
  activity: integer('activity'),
})

// ============================================================================
// 8. CANCER WAITING TIMES
// ============================================================================

export const cancerWaiting = sqliteTable('cancer_waiting', {
  recordId: integer('record_id').primaryKey({ autoIncrement: true }),
  reportingPeriod: text('reporting_period').notNull(),
  providerOdsCode: text('provider_ods_code').notNull(),
  cancerType: text('cancer_type'),
  twoWeekWaitReferrals: integer('two_week_wait_referrals'),
  twoWeekWaitSeen: integer('two_week_wait_seen'),
  thirtyOneDayReferrals: integer('thirty_one_day_referrals'),
  thirtyOneDayTreated: integer('thirty_one_day_treated'),
  sixtyTwoDayReferrals: integer('sixty_two_day_referrals'),
  sixtyTwoDayTreated: integer('sixty_two_day_treated'),
  fasterDiagnosis28Day: integer('faster_diagnosis_28_day'),
})

// ============================================================================
// 9. HCAI (HEALTHCARE ASSOCIATED INFECTIONS)
// ============================================================================

export const hcaiInfections = sqliteTable('hcai_infections', {
  recordId: integer('record_id').primaryKey({ autoIncrement: true }),
  reportingPeriod: text('reporting_period').notNull(), // Can be weekly or monthly
  providerOdsCode: text('provider_ods_code').notNull(),
  infectionType: text('infection_type').notNull(), // MRSA, MSSA, CDI, E.coli, etc.
  cases: integer('cases').notNull(),
  apportioned: integer('apportioned'), // Trust-apportioned cases
  thirdParty: integer('third_party'), // Cases from other trusts
})

// ============================================================================
// USER SAVED VIEWS & CUSTOMIZATION
// ============================================================================

export const userSavedViews = sqliteTable('user_saved_views', {
  viewId: integer('view_id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  viewName: text('view_name').notNull(),
  viewDescription: text('view_description'),
  dataSourceIds: text('data_source_ids').notNull(), // JSON array
  filtersJson: text('filters_json'), // JSON object
  chartConfigJson: text('chart_config_json'), // JSON object
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

// ============================================================================
// TYPES (TypeScript inference)
// ============================================================================

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type DataSource = typeof dataSources.$inferSelect
export type Organization = typeof organizations.$inferSelect
export type ICBHierarchy = typeof icbHierarchy.$inferSelect
export type RTTWaitingList = typeof rttWaitingList.$inferSelect
export type AEPerformance = typeof aePerformance.$inferSelect
export type WorkforceMonthly = typeof workforceMonthly.$inferSelect
export type MentalHealthActivity = typeof mentalHealthActivity.$inferSelect
export type SHMIMortality = typeof shmiMortality.$inferSelect
export type DiagnosticWaiting = typeof diagnosticWaiting.$inferSelect
export type CancerWaiting = typeof cancerWaiting.$inferSelect
export type HCAIInfections = typeof hcaiInfections.$inferSelect
export type UserSavedView = typeof userSavedViews.$inferSelect
