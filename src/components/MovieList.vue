<script setup>
import MovieCard from './MovieCard.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

defineProps({
  filmes: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <section class="lista-filmes">

    <RouterLink
        v-for="filme in filmes"
        :key="filme.id"
        :to="{
          path: `/filme/${filme.id}`,
          query: route.query
        }"
        class="link-filme"
    >

      <MovieCard
          :titulo="filme.titulo"
          :ano="filme.ano"
          :classificacao="filme.classificacao"
          :imagem="filme.imagem"
      />

    </RouterLink>

  </section>
</template>

<style scoped>
.lista-filmes {
  display: grid;
  grid-template-columns: repeat(auto-fit, 230px);
  justify-content: center;
  gap: 25px;
  padding: 20px;
}

/* Tornar o cartão clicável sem alterar o design */
.link-filme {
  text-decoration: none;
  color: inherit;
  display: block;
  border-radius: 10px;
  cursor: pointer;
}

.link-filme:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 4px;
}
</style>