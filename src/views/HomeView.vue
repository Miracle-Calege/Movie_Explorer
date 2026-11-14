<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MovieList from '../components/MovieList.vue'
import SearchBar from '../components/SearchBar.vue'
import MovieFilters from '../components/MovieFilters.vue'

import {
  obterFilmesPopulares,
  pesquisarFilmes,
  descobrirFilmes,
  pesquisarFilmesComFiltros
} from '../services/movieService.js'

// Vue Router
const route = useRoute()
const router = useRouter()

// Dados dos filmes
const filmes = ref([])
const carregando = ref(false)
const erro = ref('')

// Pesquisa e filtros
const pesquisa = ref(String(route.query.pesquisa || ''))
const genero = ref(String(route.query.genero || ''))
const ano = ref(String(route.query.ano || ''))
const classificacao = ref(String(route.query.classificacao || ''))

// Paginação
const pagina = ref(Math.max(1, Number(route.query.pagina) || 1))
const totalPaginas = ref(1)
const totalResultados = ref(0)

// Controlar pesquisas simultâneas
let numeroPedido = 0
let temporizador

// Guardar os filtros na URL
function guardarPesquisa() {

  const parametros = {}

  if (pesquisa.value.trim()) {
    parametros.pesquisa = pesquisa.value
  }

  if (genero.value) {
    parametros.genero = genero.value
  }

  if (ano.value) {
    parametros.ano = ano.value
  }

  if (classificacao.value) {
    parametros.classificacao = classificacao.value
  }

  if (pagina.value > 1) {
    parametros.pagina = String(pagina.value)
  }

  router.replace({
    path: '/',
    query: parametros
  })
}

// Carregar filmes
async function carregarFilmes() {

  const pedidoActual = ++numeroPedido

  carregando.value = true
  erro.value = ''

  try {

    let resultado

    const temPesquisa = pesquisa.value.trim() !== ''

    const temFiltros =
        genero.value !== '' ||
        ano.value !== '' ||
        classificacao.value !== ''

    // Pesquisa por título e filtros
    if (temPesquisa && temFiltros) {

      resultado = await pesquisarFilmesComFiltros(
          pesquisa.value,
          genero.value,
          ano.value,
          classificacao.value,
          pagina.value
      )

    }

    // Pesquisa apenas por título
    else if (temPesquisa) {

      resultado = await pesquisarFilmes(
          pesquisa.value,
          pagina.value
      )

    }

    // Pesquisa apenas por filtros
    else if (temFiltros) {

      resultado = await descobrirFilmes(
          genero.value,
          ano.value,
          classificacao.value,
          pagina.value
      )

    }

    // Filmes populares
    else {

      resultado = await obterFilmesPopulares(
          pagina.value
      )

    }

    // Actualizar apenas o pedido mais recente
    if (pedidoActual === numeroPedido) {

      filmes.value = resultado.filmes
      totalPaginas.value = resultado.totalPaginas
      totalResultados.value = resultado.totalResultados

    }

  } catch (e) {

    if (pedidoActual === numeroPedido) {

      erro.value = e.message
      filmes.value = []
      totalPaginas.value = 1
      totalResultados.value = 0

    }

  } finally {

    if (pedidoActual === numeroPedido) {
      carregando.value = false
    }

  }
}

// Mudar de página
function mudarPagina(novaPagina) {

  if (novaPagina < 1 || novaPagina > totalPaginas.value) {
    return
  }

  pagina.value = novaPagina

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Reiniciar a página quando os filtros mudarem
watch(
    [pesquisa, genero, ano, classificacao],
    () => {
      pagina.value = 1
    }
)

// Actualizar a pesquisa e guardar os parâmetros
watch(
    [pesquisa, genero, ano, classificacao, pagina],
    () => {

      clearTimeout(temporizador)

      numeroPedido++
      carregando.value = true

      temporizador = setTimeout(() => {

        guardarPesquisa()
        carregarFilmes()

      }, 400)

    },
    { immediate: true }
)

// Limpar o temporizador ao sair da página
onUnmounted(() => {
  clearTimeout(temporizador)
  numeroPedido++
})
</script>

<template>
  <main>

    <h1>Movie Explorer</h1>

    <p>
      Explora, pesquisa e descobre os teus filmes favoritos.
    </p>

    <!-- Pesquisa -->
    <SearchBar v-model="pesquisa" />

    <!-- Filtros -->
    <MovieFilters
        v-model:genero="genero"
        v-model:ano="ano"
        v-model:classificacao="classificacao"
    />

    <!-- Carregamento -->
    <p v-if="carregando">
      A carregar filmes...
    </p>

    <!-- Erro -->
    <p v-else-if="erro">
      {{ erro }}
    </p>

    <!-- Resultados -->
    <template v-else>

      <p>
        Filmes encontrados: {{ totalResultados }}
      </p>

      <MovieList
          v-if="filmes.length > 0"
          :filmes="filmes"
      />

      <p v-else>
        Nenhum filme encontrado.
      </p>

      <!-- Paginação -->
      <div
          v-if="totalPaginas > 1"
          class="paginacao"
      >

        <button
            :disabled="pagina === 1"
            @click="mudarPagina(pagina - 1)"
        >
          ← Anterior
        </button>

        <span>
          Página {{ pagina }} de {{ totalPaginas }}
        </span>

        <button
            :disabled="pagina === totalPaginas"
            @click="mudarPagina(pagina + 1)"
        >
          Próxima →
        </button>

      </div>

    </template>

  </main>
</template>

<style scoped>
main {
  padding: 40px;
  text-align: center;
}

h1 {
  color: #2563eb;
  font-size: 36px;
}

.paginacao {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  margin-bottom: 30px;
}

.paginacao button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-size: 15px;
  cursor: pointer;
}

.paginacao button:hover:not(:disabled) {
  background: #1d4ed8;
}

.paginacao button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.paginacao span {
  font-size: 16px;
  font-weight: bold;
}
</style>