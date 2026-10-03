/**
 * ODS (Organization Data Service) Loader
 * Fetches NHS organization data from ODS API
 */
import { pathToFileURL } from 'node:url'
import { db, schema } from '../../db'

const ODS_API_BASE = 'https://directory.spineservices.nhs.uk/ORD/2-0-0'

interface ODSOrganization {
  OrgId: string
  Name: string
  Status: string
  OrgRecordClass: string
  PostCode?: string
  LastChangeDate: string
  PrimaryRoleId?: string
  Roles?: Array<{
    id: string
    primaryRole: boolean
  }>
  GeoLoc?: {
    Location: {
      AddrLn1?: string
      Town?: string
      PostCode?: string
    }
  }
  Rels?: {
    Rel: Array<{
      Target: {
        OrgId: {
          extension: string
        }
      }
      id: string
      Status: string
    }>
  }
}

async function fetchOrganizationsByRole(roleId: string, limit = 1000, offset = 0): Promise<ODSOrganization[]> {
  const url = `${ODS_API_BASE}/organisations?PrimaryRoleId=${roleId}&Status=Active&Limit=${limit}&Offset=${offset}`
  
  console.log(`Fetching organizations with role ${roleId}...`)
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`ODS API returned ${response.status}`)
    }
    
    const data = await response.json()
    return data.Organisations || []
  } catch (error) {
    console.error(`Error fetching ODS data: ${error}`)
    return []
  }
}

async function loadOrganizations() {
  console.log('🏥 Loading NHS Organizations from ODS...')
  
  // Key organization types to load
  const rolesToLoad = [
    { id: 'RO197', name: 'NHS Trust' },
    { id: 'RO198', name: 'NHS Trust Site' },
    { id: 'RO261', name: 'ICB' },
    { id: 'RO213', name: 'Sub ICB Location' },
  ]
  
  let totalLoaded = 0
  
  for (const role of rolesToLoad) {
    console.log(`\n📋 Loading ${role.name} organizations...`)
    
    // ODS Offset is 1-based. Offset 0 is rejected.
    let offset = 1
    const limit = 1000
    let hasMore = true
    
    while (hasMore) {
      const orgs = await fetchOrganizationsByRole(role.id, limit, offset)
      
      if (orgs.length === 0) {
        hasMore = false
        break
      }
      
      const rows = orgs.map(org => ({
        odsCode: org.OrgId,
        organizationName: org.Name,
        organizationType: role.name,
        status: org.Status,
        addressLine1: org.GeoLoc?.Location?.AddrLn1,
        city: org.GeoLoc?.Location?.Town,
        postcode: org.GeoLoc?.Location?.PostCode || org.PostCode,
        lastUpdated: org.LastChangeDate,
      }))

      try {
        db.transaction((tx) => {
          for (const row of rows) {
            tx.insert(schema.organizations).values(row).onConflictDoUpdate({
              target: schema.organizations.odsCode,
              set: {
                organizationName: row.organizationName,
                status: row.status,
                lastUpdated: row.lastUpdated,
              },
            }).run()
          }
        })
        totalLoaded += rows.length
      } catch (error) {
        console.error(`Error inserting ${role.name} page at offset ${offset}: ${error}`)
      }
      
      console.log(`  Loaded ${orgs.length} organizations (offset: ${offset})`)
      
      offset += limit
      
      if (orgs.length < limit) {
        hasMore = false
      }
      
      // Respectful delay
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
  
  console.log(`\n✅ Loaded ${totalLoaded} organizations from ODS`)
}

// Run if called directly
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  loadOrganizations()
    .then(() => {
      console.log('✅ ODS load complete')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ ODS load failed:', error)
      process.exit(1)
    })
}

export { loadOrganizations }
