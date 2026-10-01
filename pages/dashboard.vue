<template>
  <div class="min-h-screen bg-atlas-bg">
    <!-- Header -->
    <header class="border-b border-atlas-gray-light bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-x-3">
            <h1 class="text-2xl font-bold text-atlas-teal">ATLAS</h1>
            <span class="text-sm text-atlas-slate">Dashboard</span>
          </div>
          <div class="flex items-center gap-x-4">
            <span class="text-sm text-atlas-slate">{{ user?.email }}</span>
            <UButton @click="logout" size="sm" color="gray" variant="outline">
              Logout
            </UButton>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="rounded-lg border border-atlas-gray-light bg-white p-6 shadow-sm"
        >
          <div class="text-sm font-medium text-atlas-slate">{{ stat.label }}</div>
          <div class="mt-2 text-3xl font-bold text-atlas-charcoal">{{ stat.value }}</div>
          <div class="mt-2 text-xs text-atlas-slate">{{ stat.change }}</div>
        </div>
      </div>

      <!-- Data Sources -->
      <div class="mt-8">
        <h2 class="text-xl font-bold text-atlas-charcoal">Available Data Sources</h2>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="source in dataSources"
            :key="source.sourceId"
            class="rounded-lg border border-atlas-gray-light bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-atlas-charcoal">{{ source.sourceName }}</h3>
                <p class="mt-1 text-sm text-atlas-slate">{{ source.sourceCategory }}</p>
              </div>
              <span
                v-if="source.active"
                class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
              >
                Active
              </span>
            </div>
            <p class="mt-2 text-xs text-atlas-slate">{{ source.updateFrequency }} updates</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8">
        <h2 class="text-xl font-bold text-atlas-charcoal">Quick Actions</h2>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <UButton size="lg" block color="primary" variant="outline">
            📊 Create Report
          </UButton>
          <UButton size="lg" block color="primary" variant="outline">
            🔍 Explore Data
          </UButton>
          <UButton size="lg" block color="primary" variant="outline">
            💾 Saved Views
          </UButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const user = ref<any>(null)
const dataSources = ref<any[]>([])

const stats = [
  { label: 'Organizations', value: '---', change: 'Loading...' },
  { label: 'Data Points', value: '---', change: 'Loading...' },
  { label: 'Reports', value: '---', change: 'Loading...' },
  { label: 'Last Updated', value: '---', change: 'Loading...' },
]

onMounted(async () => {
  // Check auth
  const token = localStorage.getItem('atlas_token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    // Fetch user profile
    user.value = await $fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Fetch data sources
    const response = await $fetch('/api/data-sources?active=true')
    dataSources.value = response.sources
  } catch (error) {
    console.error('Auth failed:', error)
    router.push('/login')
  }
})

function logout() {
  localStorage.removeItem('atlas_token')
  router.push('/')
}

useHead({
  title: 'Dashboard',
})
</script>
