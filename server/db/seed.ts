/**
 * Database Seed Script
 * Seeds initial data sources and admin user
 */
import { db, schema } from './index'
import bcrypt from 'bcrypt'

async function seed() {
  console.log('🌱 Seeding ATLAS database...')

  // Seed admin user
  const passwordHash = await bcrypt.hash('admin123', 10)
  
  try {
    await db.insert(schema.users).values({
      email: 'admin@atlas.nhs.uk',
      passwordHash,
      name: 'System Administrator',
      role: 'admin',
    }).onConflictDoNothing()
    console.log('✅ Admin user created (admin@atlas.nhs.uk / admin123)')
  } catch (error) {
    console.log('ℹ️  Admin user already exists')
  }

  // Seed data sources registry
  const dataSources = [
    {
      sourceId: 'ods',
      sourceName: 'Organisation Data Service',
      sourceDescription: 'NHS organizations registry with codes, names, addresses, and relationships',
      sourceCategory: 'Infrastructure',
      publisher: 'NHS Digital',
      updateFrequency: 'Weekly',
      typicalLagDays: 0,
      endpointUrl: 'https://directory.spineservices.nhs.uk/ORD/2-0-0',
      apiCredentialsRequired: false,
      granularity: 'Organization',
      active: true,
    },
    {
      sourceId: 'rtt',
      sourceName: 'Referral to Treatment (RTT) Waiting Lists',
      sourceDescription: 'Elective waiting times and waiting list sizes by specialty',
      sourceCategory: 'Operational',
      publisher: 'NHS England',
      updateFrequency: 'Monthly',
      typicalLagDays: 35,
      endpointUrl: 'https://www.england.nhs.uk/statistics/statistical-work-areas/rtt-waiting-times',
      apiCredentialsRequired: false,
      granularity: 'Provider + Specialty',
      active: true,
    },
    {
      sourceId: 'ae',
      sourceName: 'A&E Attendances and Emergency Admissions',
      sourceDescription: 'Emergency department performance, 4-hour breaches, 12-hour trolley waits, ambulance handovers',
      sourceCategory: 'Operational',
      publisher: 'NHS England',
      updateFrequency: 'Monthly',
      typicalLagDays: 35,
      endpointUrl: 'https://www.england.nhs.uk/statistics/statistical-work-areas/ae-waiting-times-and-activity',
      apiCredentialsRequired: false,
      granularity: 'Provider + Department Type',
      active: true,
    },
    {
      sourceId: 'workforce',
      sourceName: 'NHS Workforce Statistics (ESR)',
      sourceDescription: 'Staff headcount, FTE, vacancies, sickness, turnover, bank and agency use by staff group',
      sourceCategory: 'Workforce',
      publisher: 'NHS England',
      updateFrequency: 'Monthly',
      typicalLagDays: 60,
      endpointUrl: 'https://digital.nhs.uk/data-and-information/publications/statistical/nhs-workforce-statistics',
      apiCredentialsRequired: false,
      granularity: 'Organization + Staff Group',
      active: true,
    },
    {
      sourceId: 'mhsds',
      sourceName: 'Mental Health Services Dataset (MHSDS)',
      sourceDescription: 'Mental health referrals, contacts, caseloads, and service activity',
      sourceCategory: 'Service Line',
      publisher: 'NHS England',
      updateFrequency: 'Monthly',
      typicalLagDays: 60,
      endpointUrl: 'https://digital.nhs.uk/data-and-information/data-collections-and-data-sets/data-sets/mental-health-services-data-set',
      apiCredentialsRequired: false,
      granularity: 'Provider + Service Type',
      active: true,
    },
    {
      sourceId: 'shmi',
      sourceName: 'Summary Hospital Mortality Indicator (SHMI)',
      sourceDescription: 'Quarterly hospital mortality ratios (observed vs expected deaths)',
      sourceCategory: 'Quality',
      publisher: 'NHS England',
      updateFrequency: 'Quarterly',
      typicalLagDays: 180,
      endpointUrl: 'https://digital.nhs.uk/data-and-information/publications/statistical/shmi',
      apiCredentialsRequired: false,
      granularity: 'Provider + Diagnosis Group',
      active: true,
    },
    {
      sourceId: 'diagnostics',
      sourceName: 'Diagnostic Waiting Times (DM01)',
      sourceDescription: '6-week diagnostic waiting times for imaging and endoscopy',
      sourceCategory: 'Operational',
      publisher: 'NHS England',
      updateFrequency: 'Monthly',
      typicalLagDays: 35,
      endpointUrl: 'https://www.england.nhs.uk/statistics/statistical-work-areas/diagnostics-waiting-times-and-activity',
      apiCredentialsRequired: false,
      granularity: 'Provider + Test Type',
      active: true,
    },
    {
      sourceId: 'cancer',
      sourceName: 'Cancer Waiting Times',
      sourceDescription: '2-week, 31-day, and 62-day cancer waiting time standards',
      sourceCategory: 'Operational',
      publisher: 'NHS England',
      updateFrequency: 'Monthly',
      typicalLagDays: 45,
      endpointUrl: 'https://www.england.nhs.uk/statistics/statistical-work-areas/cancer-waiting-times',
      apiCredentialsRequired: false,
      granularity: 'Provider + Cancer Type',
      active: true,
    },
    {
      sourceId: 'hcai',
      sourceName: 'Healthcare Associated Infections (HCAI)',
      sourceDescription: 'MRSA, MSSA, C. difficile, and Gram-negative bloodstream infections',
      sourceCategory: 'Quality',
      publisher: 'UKHSA',
      updateFrequency: 'Monthly',
      typicalLagDays: 30,
      endpointUrl: 'https://fingertips.phe.org.uk/profile/amr-local-indicators',
      apiCredentialsRequired: false,
      credentialsGuideUrl: 'https://fingertips.phe.org.uk/api',
      granularity: 'Provider + Infection Type',
      active: true,
    },
    {
      sourceId: 'icb',
      sourceName: 'ICB Hierarchy',
      sourceDescription: 'Integrated Care Board and region geographic hierarchies',
      sourceCategory: 'Infrastructure',
      publisher: 'NHS England',
      updateFrequency: 'Quarterly',
      typicalLagDays: 0,
      endpointUrl: 'https://www.england.nhs.uk/publication/integrated-care-boards',
      apiCredentialsRequired: false,
      granularity: 'ICB + Region',
      active: true,
    },
  ]

  for (const source of dataSources) {
    try {
      await db.insert(schema.dataSources).values(source).onConflictDoNothing()
      console.log(`✅ Data source: ${source.sourceName}`)
    } catch (error) {
      console.log(`ℹ️  ${source.sourceName} already exists`)
    }
  }

  console.log('🎉 Seed complete!')
}

seed().catch(console.error)
