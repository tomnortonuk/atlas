<template>
  <div class="flex min-h-screen items-center justify-center bg-atlas-bg px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-atlas-teal">ATLAS</h1>
        <p class="mt-2 text-sm text-atlas-slate">Navigate the complete picture</p>
      </div>

      <div class="rounded-lg bg-white p-8 shadow-lg">
        <UForm :state="form" @submit="handleSubmit" class="space-y-6">
          <UFormGroup label="Email" name="email" required>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password" required>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Enter your password"
              size="lg"
            />
          </UFormGroup>

          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            :loading="loading"
          >
            {{ isRegister ? 'Register' : 'Sign In' }}
          </UButton>
        </UForm>

        <div class="mt-6 text-center">
          <button
            @click="isRegister = !isRegister"
            class="text-sm text-atlas-teal hover:text-atlas-teal-600"
          >
            {{ isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register" }}
          </button>
        </div>

        <div v-if="error" class="mt-4 rounded-md bg-red-50 p-4">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>

      <p class="text-center text-xs text-atlas-slate">
        Demo credentials: admin@atlas.nhs.uk / admin123
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const form = ref({
  email: '',
  password: '',
  name: '',
})
const loading = ref(false)
const error = ref('')
const isRegister = ref(false)

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    const endpoint = isRegister.value ? '/api/auth/register' : '/api/auth/login'
    const response = await $fetch(endpoint, {
      method: 'POST',
      body: form.value,
    })

    // Store token
    localStorage.setItem('atlas_token', response.token)

    // Redirect to dashboard
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.data?.message || 'Authentication failed. Please try again.'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Login',
})
</script>
