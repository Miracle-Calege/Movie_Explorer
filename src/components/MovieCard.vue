<script setup>
defineProps({
  titulo: String,
  ano: Number,
  classificacao: Number,
  imagem: String
})
</script>

<template>
  <div class="filme">
    <img :src="imagem" :alt="titulo">

    <h3>{{ titulo }}</h3>
    <p>Ano: {{ ano }}</p>
    <p>⭐ {{ classificacao.toFixed(1) }}</p>
  </div>
</template>

<style scoped>
.filme {
  width: 200px;
  padding: 15px;
  border-radius: 10px;
  background: #1e293b;
  color: white;
}

.filme img {
  width: 100%;
  border-radius: 8px;
}
</style>