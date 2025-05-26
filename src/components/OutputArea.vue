<template>
  <div id="output-area">
    <div style="display: flex; align-items: center; justify-items: center;">
      <p style="font-size: min(calc(14vw / 5), 20px); color: #d3bb8f; margin: min(calc(11vw / 5), 16px);">出力データ</p>
      <button class="info-icon" @click="$emit('show-info')">
        <img src="@/assets/info.webp" alt="Info"/>
      </button>
    </div>
    
    <div id="output-inner-area">
      <div id="distribution-area" class="info-section">
        <p>確率分布</p>
        <!-- 画像表示 -->
        <div id="distribution-inner-area" v-if="distributionImg">
          <img id="distribution-img" :src="distributionImg" alt="Distribution Image" />
        </div>
      </div>
      <div id="statistics-area" class="info-section">
        <p>データ表</p>
        <div class="data-table">
          <div class="row" v-for="(row, idx) in percentile" :key="'percentile-' + idx">
            <div class="cell">{{ row[0] }}%</div>
            <div class="cell">{{ row[1] }}</div>
          </div>
        </div>
        <div class="data-table">
          <div class="row">
            <div class="cell">平均</div>
            <div class="cell">{{ average }}</div>
          </div>
          <div class="row">
            <div class="cell">分散</div>
            <div class="cell">{{ variance }}</div>
          </div>
          <div class="row">
            <div class="cell">歪度</div>
            <div class="cell">{{ skewness }}</div>
          </div>
          <div class="row">
            <div class="cell">尖度</div>
            <div class="cell">{{ kurtosis }}</div>
          </div>
        </div>
      </div>
      <button class="def-button" style="font-size: min(calc(9vw / 5), 16px);" @click="$emit('update-output')">更新</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "OutputArea",
  props: {
    distributionImg: String,
    percentile: Array,
    average: [Number, String],
    variance: [Number, String],
    skewness: [Number, String],
    kurtosis: [Number, String]
  },
  emits: ["update-output", "show-info"]
}
</script>