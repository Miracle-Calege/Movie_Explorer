<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import {
  obterDetalhesFilme,
  obterVideosFilme
} from '../services/movieService.js'

const route = useRoute()

const filme = ref(null)
const trailer = ref(null)
const carregando = ref(true)
const erro = ref('')

let numeroPedido = 0

// Formatar data
function formatarData(data) {

  if (!data) {
    return 'Não disponível'
  }

  const partes = data.split('-')

  if (partes.length !== 3) {
    return data
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

// Traduzir países
function traduzirPais(nome) {

  const traducoes = {
    'United States of America': 'Estados Unidos da América',
    'United Kingdom': 'Reino Unido',
    'Germany': 'Alemanha',
    'France': 'França',
    'Spain': 'Espanha',
    'Italy': 'Itália',
    'Japan': 'Japão',
    'China': 'China',
    'Brazil': 'Brasil',
    'Canada': 'Canadá',
    'India': 'Índia',
    'Australia': 'Austrália',
    'South Korea': 'Coreia do Sul'
  }

  return traducoes[nome] || nome
}

// Carregar detalhes
async function carregarDetalhes() {

  const pedidoActual = ++numeroPedido

  carregando.value = true
  erro.value = ''
  filme.value = null
  trailer.value = null

  try {

    const id = route.params.id

    const detalhes = await obterDetalhesFilme(id)

    if (pedidoActual !== numeroPedido) return

    filme.value = detalhes

    // Obter trailer
    try {

      const videos = await obterVideosFilme(id)

      if (pedidoActual !== numeroPedido) return

      trailer.value = videos.find(video =>
          video.site === 'YouTube' &&
          video.type === 'Trailer' &&
          video.official
      ) || videos.find(video =>
          video.site === 'YouTube' &&
          video.type === 'Trailer'
      ) || null

    } catch (e) {
      console.warn('Trailer indisponível:', e)
    }

  } catch (e) {

    if (pedidoActual === numeroPedido) {
      erro.value = e.message
    }

  } finally {

    if (pedidoActual === numeroPedido) {
      carregando.value = false
    }

  }
}

watch(
    () => route.params.id,
    carregarDetalhes,
    { immediate: true }
)
</script>

<template>

  <main>

    <!-- Voltar mantendo os filtros -->
    <RouterLink
        :to="{ path: '/', query: route.query }"
        class="voltar"
    >
      ← Voltar aos filmes
    </RouterLink>

    <p v-if="carregando">
      A carregar detalhes...
    </p>

    <p v-else-if="erro">
      {{ erro }}
    </p>

    <div v-else-if="filme" class="detalhes">

      <!-- Cartaz -->
      <img
          v-if="filme.poster_path"
          :src="`https://image.tmdb.org/t/p/w500${filme.poster_path}`"
          :alt="filme.title"
          class="cartaz"
      />

      <!-- Informações -->
      <section class="informacoes">

        <h1>{{ filme.title }}</h1>

        <p>
          <strong>Título original:</strong>
          {{ filme.original_title }}
        </p>

        <p>
          <strong>Data de lançamento:</strong>
          {{ formatarData(filme.release_date) }}
        </p>

        <p>
          <strong>Classificação:</strong>
          ⭐ {{ filme.vote_average.toFixed(1) }}
        </p>

        <p>
          <strong>Duração:</strong>
          {{ filme.runtime ? `${filme.runtime} minutos` : 'Não disponível' }}
        </p>

        <p>
          <strong>Géneros:</strong>
          {{ filme.genres.map(g => g.name).join(', ') || 'Não disponível' }}
        </p>

        <p>
          <strong>Países de produção:</strong>
          {{
            filme.production_countries
                .map(p => traduzirPais(p.name))
                .join(', ') || 'Não disponível'
          }}
        </p>

        <h2>Sinopse</h2>

        <p>
          {{ filme.overview || 'Sinopse não disponível.' }}
        </p>

      </section>

    </div>

    <!-- Trailer -->
    <section v-if="trailer && !carregando" class="trailer">

      <h2>Trailer</h2>

      <iframe
          :src="`https://www.youtube-nocookie.com/embed/${trailer.key}`"
          title="Trailer do filme"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
      ></iframe>

    </section>

  </main>

</template>

<style scoped>
main {
  max-width: 1100px;
  margin: auto;
  padding: 40px 20px;
}

.voltar {
  display: inline-block;
  margin-bottom: 30px;
  color: #2563eb;
  text-decoration: none;
  font-weight: bold;
}

.detalhes {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.cartaz {
  width: 300px;
  border-radius: 12px;
}

.informacoes {
  flex: 1;
}

.informacoes h1 {
  font-size: 32px;
  color: #2563eb;
}

.informacoes p {
  line-height: 1.8;
}

.trailer {
  margin-top: 50px;
}

.trailer iframe {
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 12px;
}

@media (max-width: 700px) {

  .detalhes {
    flex-direction: column;
    align-items: center;
  }

  .cartaz {
    width: 100%;
    max-width: 300px;
  }

  .informacoes {
    width: 100%;
  }

}
</style>