<template>
  <div class="min-h-screen bg-atlas-bg">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-atlas-teal to-atlas-green">
      <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            ATLAS
          </h1>
          <p class="mt-4 text-xl text-atlas-teal-100">
            Navigate the complete picture
          </p>
          <p class="mt-6 max-w-2xl mx-auto text-lg text-atlas-teal-50">
            Population health and care intelligence across NHS trusts, ICBs, and national datasets.
            Explore 10 priority data sources with 12 months of historical insight.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <UButton
              to="/login"
              size="xl"
              color="white"
              variant="solid"
            >
              Get Started
            </UButton>
            <UButton
              to="/about"
              size="xl"
              color="white"
              variant="outline"
            >
              Learn More
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight text-atlas-charcoal">
          Comprehensive Population Health Intelligence
        </h2>
        <p class="mt-4 text-lg text-atlas-slate">
          Access trusted NHS data sources in one unified platform
        </p>
      </div>

      <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="feature in features"
          :key="feature.name"
          class="relative rounded-lg border border-atlas-gray-light bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-atlas-teal/10">
              <span class="text-2xl">{{ feature.icon }}</span>
            </div>
            <h3 class="text-lg font-semibold text-atlas-charcoal">
              {{ feature.name }}
            </h3>
          </div>
          <p class="mt-4 text-sm text-atlas-slate">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Data Sources -->
    <div class="bg-white">
      <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-atlas-charcoal">
            10 Priority Data Sources
          </h2>
          <p class="mt-4 text-lg text-atlas-slate">
            12 months of historical data, updated regularly
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div
            v-for="source in dataSources"
            :key="source"
            class="rounded-lg border border-atlas-gray-light bg-atlas-bg p-4 text-center text-sm font-medium text-atlas-charcoal"
          >
            {{ source }}
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="bg-atlas-teal">
      <div class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold tracking-tight text-white">
          Ready to explore?
        </h2>
        <p class="mt-4 text-lg text-atlas-teal-100">
          Sign up for free and start navigating the complete picture.
        </p>
        <div class="mt-8">
          <UButton
            to="/login"
            size="xl"
            color="white"
            variant="solid"
          >
            Get Started
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    name: 'Operational Intelligence',
    icon: '📊',
    description: 'RTT waiting lists, A&E performance, diagnostic and cancer waiting times across all NHS trusts.',
  },
  {
    name: 'Workforce Insights',
    icon: '👥',
    description: 'Staffing levels, vacancies, sickness, turnover, and bank/agency usage by staff group.',
  },
  {
    name: 'Quality & Safety',
    icon: '🏥',
    description: 'SHMI mortality ratios and healthcare-associated infection surveillance.',
  },
  {
    name: 'Mental Health',
    icon: '🧠',
    description: 'Mental health service activity, referrals, caseloads, and access metrics.',
  },
  {
    name: 'Organizational Context',
    icon: '🗺️',
    description: 'NHS organization registry, ICB hierarchies, and geographic groupings.',
  },
  {
    name: 'Custom Views',
    icon: '⚙️',
    description: 'Save custom filters, visualizations, and reports. Share with your team.',
  },
]

const dataSources = [
  'ODS Organizations',
  'RTT Waiting Lists',
  'A&E Performance',
  'Workforce (ESR)',
  'Mental Health (MHSDS)',
  'SHMI Mortality',
  'Diagnostic Waiting',
  'Cancer Waiting',
  'HCAI Infections',
  'ICB Hierarchy',
]

useHead({
  title: 'ATLAS - Navigate the complete picture',
})
</script>
