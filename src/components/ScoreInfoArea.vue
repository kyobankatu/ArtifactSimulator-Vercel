<template>
  <div id="score-info-area">
    <p style="font-size: min(calc(14vw / 5), 20px); color: #d3bb8f; margin: min(calc(11vw / 5), 16px);">スコア情報</p>
    <div id="score-info-inner-area">
      <div id="score-type-area" class="info-section">
        <p>スコア計算方法</p>
        <select class="def-selecter" :value="score_type" @change="$emit('update:score_type', $event.target.value)">
          <option value="atk">攻撃換算</option>
          <option value="hp">HP換算</option>
          <option value="em">熟知換算</option>
        </select>
      </div>
      <div id="slider-area">
        <div id="init-score-area" class="info-section">
          <p>現在のスコア</p>
          <div class="range-slider">
            <input
              type="range"
              id="init-slider"
              min="0"
              max="65"
              step="0.1"
              :value="initScore_formatted"
              @input="$emit('updateInitScore', $event.target.value)"
            />
            <input
              id="init-score"
              type="number"
              min="0"
              max="65"
              step="0.1"
              :value="initScore_formatted"
              @blur="$emit('updateInitScore', $event.target.value)"
            />
          </div>
        </div>
        <div id="search-score-area" class="info-section">
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
              id="search-score"
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