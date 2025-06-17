<template>
  <div class="score-info-area">
    <p class="score-info-title">スコア情報</p>
    <div class="score-info-inner-area">
      <div class="score-type-area info-section">
        <p>スコア計算方法</p>
        <select class="def-selecter" :value="score_type" @change="$emit('update:score_type', $event.target.value)">
          <option value="atk">攻撃換算</option>
          <option value="hp">HP換算</option>
          <option value="em">熟知換算</option>
        </select>
      </div>
      <div class="slider-area">
        <div class="init-score-area info-section">
          <p>現在のスコア</p>
          <div class="range-slider">
            <input
              id="init-slider"
              type="range"
              min="0"
              max="65"
              step="0.1"
              :value="initScore_formatted"
              @input="$emit('updateInitScore', $event.target.value)"
            />
            <input
              class="init-score"
              type="number"
              min="0"
              max="65"
              step="0.1"
              :value="initScore_formatted"
              @blur="$emit('updateInitScore', $event.target.value)"
            />
          </div>
        </div>
        <div class="search-score-area info-section">
          <p>調査スコア</p>
          <div class="range-slider">
            <input
              type="range"
              min="0"
              max="65"
              step="0.1"
              :value="searchScore_formatted"
              @input="$emit('updateSearchScore', $event.target.value)"
            />
            <input
              class="search-score"
              type="number"
              min="0"
              max="65"
              step="0.1"
              :value="searchScore_formatted"
              @blur="$emit('updateSearchScore', $event.target.value)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScoreInfoArea",
  props: {
    score_type: String,
    initScore_formatted: String,
    searchScore_formatted: String
  },
  emits: [
    "update:score_type",
    "updateInitScore",
    "updateSearchScore"
  ]
}
</script>

<style scoped>
.score-info-title {
  font-size: min(calc(14vw / 5), 20px);
  color: #d3bb8f;
  margin: min(calc(11vw / 5), 16px);
}

.score-info-area {
  margin-bottom: 20px;
  width: fit-content;
  max-width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  background-color: #424858;
  border-radius: 5px;
  outline: 1px solid #d3bb8f;
  outline-offset: -5px;
}

.score-info-inner-area {
  margin: 0px min(calc(14vw / 5), 20px);

  display: flex;
  align-items: flex-start;
  justify-items: center;
  gap: min(calc(11vw / 5), 16px);
}

.score-type-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

.slider-area {
  margin-bottom: min(calc(14vw / 5), 20px);
  width: fit-content;
  height: fit-content;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.init-score-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

.range-slider {
  margin-bottom: 5px;

  display: flex;
  align-items: center;
}

.range-slider input[type="range"] {
  width: min(calc(100vw / 5), 200px);
}

.init-score {
  width: min(calc(45vw / 5), 70px);

  text-align: center;
  font-size: min(calc(9vw / 5), 16px);
  background: none;
  border: none;
  color: #fff;
}

.search-score-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

.search-score {
  width: min(calc(45vw / 5), 70px);

  text-align: center;
  font-size: min(calc(9vw / 5), 16px);
  background: none;
  border: none;
  color: #fff;
}
</style>