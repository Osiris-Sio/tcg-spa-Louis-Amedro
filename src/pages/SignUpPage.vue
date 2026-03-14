<template>
  <NCard title="Connexion" size="small">
    <NForm ref="formRef" @submit.prevent="handleSignUp">
      <NFormItem label="Nom d'utilisateur">
        <NInput v-model:value="username" type="text" placeholder="Dresseur42" />
      </NFormItem>

      <NFormItem path="email" label="Email">
        <NInput
          v-model:value="email"
          type="email"
          placeholder="votre@email.com"
        />
      </NFormItem>

      <NFormItem label="Mot de passe">
        <NInput
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          placeholder="⸱⸱⸱⸱⸱⸱⸱⸱⸱⸱"
        />
      </NFormItem>

      <NAlert v-if="error" type="error"> {{ error }}</NAlert>

      <NButton
        attr-type="submit"
        type="success"
        :loading="loading"
        icon-placement="left"
      >
        S'inscrire
      </NButton>

      <p>
        Déjà un compte ? <RouterLink to="/sign-in">Se connecter</RouterLink>
      </p>
    </NForm>
  </NCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useApi } from '@/composables/useApi'
import router, { ROUTES } from '@/router'
import { useAuthStore } from '@/store/auth'

const api = useApi()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

const username = ref('')
const email = ref('')
const password = ref('')

// Inscrit l'utilisateur en récupérant ses informations via le formulaire et une requête à l'API.
const handleSignUp = async () => {
  loading.value = true // Active le chargement
  try {
    const reponse = await api.signUp({
      // Demande à l'API d'inscrire l'utilisateur
      email: email.value,
      password: password.value,
      username: username.value,
    })
    authStore.signIn(reponse.token, reponse.user) // Connecte automatiquement l'utilisateur avec le token et les informations de l'utilisateur reçu
    router.push(ROUTES.HOME) // Redirige vers la page d'accueil si tout est bon
  } catch (e) {
    error.value = // S'il y a une erreur, affiche un message d'erreur
      e instanceof Error
        ? e.message
        : "Erreur d'inscription. Veuillez vérifier vos informations."
  }
  loading.value = false // Désactive le chargement
}
</script>

<style scoped>
.n-card {
  justify-self: center;
  max-width: 600px;
  margin-top: 20px;
}

.n-button {
  width: 100%;
}

p {
  text-align: center;
}

.n-alert {
  margin-bottom: 15px;
}
</style>
