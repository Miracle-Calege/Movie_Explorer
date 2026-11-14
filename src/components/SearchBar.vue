<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

function actualizarPesquisa(evento) {
  emit('update:modelValue', evento.target.value)
}
</script>

<template>
  <div class="pesquisa">
    <input
        type="search"
        :value="modelValue"
        @input="actualizarPesquisa"
        placeholder="Pesquisar filmes..."
    />
  </div>
</template>

<style scoped>
.pesquisa {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

input {
  width: 100%;
  max-width: 450px;
  padding: 14px 18px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

input:focus {
  outline: 2px solid #2563eb;
}
</style>