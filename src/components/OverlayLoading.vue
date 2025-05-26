<template>
  <div :class="['overlay', { active: loading }]">
    <img id="paimon-img" :src="paimonImg">
    <p>{{ loading_msg }}</p>
    <div id="loading-artifact-container">
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img"
        class="loading-artifact-img"
        :style="{ opacity: opacities[index] }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "OverlayLoading",
  props: {
    loading: Boolean,
    paimonImg: String,
    loading_msg: String,
    images: Array,
    opacities: Array
  }
}
</script>

<style scoped>
#paimon-img {
  width: min(calc(100vw / 5), 150px);
  height: auto;
}

.loading-artifact-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.loading-artifact-img {
  width: min(calc(30vw / 5), 50px);
  height: auto;

  opacity: 0.2; /* 初期状態 */
  transition: opacity 0.3s ease-in-out;
}
</style>