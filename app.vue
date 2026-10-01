<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: '%s | ATLAS',
  meta: [
    { name: 'description', content: 'Navigate the complete picture across population health and care' }
  ],
})
</script>
