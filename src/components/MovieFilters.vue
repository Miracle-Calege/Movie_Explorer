<script setup>
defineProps({
  genero: String,
  ano: String,
  classificacao: String
})

const emit = defineEmits([
  'update:genero',
  'update:ano',
  'update:classificacao'
])

const anoActual = new Date().getFullYear()
</script>

<template>
  <div class="filtros">


    <select
        :value="genero"
        @change="emit('update:genero', $event.target.value)"
    >
      <option value="">Todos os géneros</option>
      <option value="28">Acção</option>
      <option value="12">Aventura</option>
      <option value="878">Ficção científica</option>
      <option value="35">Comédia</option>
      <option value="18">Drama</option>
      <option value="27">Terror</option>
      <option value="53">Thriller</option>
      <option value="16">Animação</option>
      <option value="10749">Romance</option>
      <option value="14">Fantasia</option>
      <option value="9648">Mistério</option>
      <option value="99">Documentário</option>
    </select>


    <select
        :value="ano"
        @change="emit('update:ano', $event.target.value)"
    >
      <option value="">Todos os anos</option>

      <option
          v-for="a in 30"
          :key="a"
          :value="anoActual - a + 1"
      >
        {{ anoActual - a + 1 }}
      </option>
    </select>


    <select
        :value="classificacao"
        @change="emit('update:classificacao', $event.target.value)"
    >
      <option value="">Todas as classificações</option>
      <option value="5">5 ou superior</option>
      <option value="6">6 ou superior</option>
      <option value="7">7 ou superior</option>
      <option value="8">8 ou superior</option>
      <option value="8.5">8.5 ou superior</option>
      <option value="9">9 ou superior</option>
    </select>

  </div>
</template>

<style scoped>
.filtros {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;
}

select {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  background: white;
}
</style>