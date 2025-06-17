<template>
  <div class="output-area">
    <div class="output-header">
      <p class="output-title">出力データ</p>
      <button class="info-icon" @click="$emit('show-info')">
        <img src="@/assets/info.webp" alt="Info"/>
      </button>
    </div>
    
    <div class="output-inner-area">
      <div class="distribution-area">
        <div class="distribution-result-area info-section">
          <p class="distribution-area-title">確率分布</p>
          <!-- 画像表示 -->
          <div class="distribution-result-inner-area" v-if="distributionImg">
            <img class="distribution-img" :src="distributionImg" alt="Distribution Image" />
          </div>
        </div>
        <div class="distribution-info-area info-section">
          <p class="distribution-area-title">区間でまとめる</p>
          <div class="range-slider">
            <input
              id="bold-space-slider"
              type="range"
              min="0"
              max="20"
              step="0.5"
              :value="bold_space_formatted"
              @input="$emit('updateBoldSpace', $event.target.value)"
            />
            <input
              v-if="bold_space_formatted !== '0.0'"
              class="bold-space"
              type="number"
              min="0"
              max="20"
              step="0.5"
              :value="bold_space_formatted"
              @blur="$emit('updateBoldSpace', $event.target.value)"
            />
            <p v-if="bold_space_formatted === '0.0'" class="bold-space-label">
              通常表示
            </p>
          </div>
        </div>
      </div>
      <div class="statistics-area info-section">
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
      <button class="def-button output-update-btn" @click="$emit('update-output')">更新</button>
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
    kurtosis: [Number, String],
    bold_space_formatted: [Number, String]
  },
  emits: ["update-output", "show-info", "updateBoldSpace"]
}
</script>

<style scoped>
.output-area {
  margin-bottom: 20px;
  width: 80%;
  max-width: 900px;
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  background-color: #424858;
  border-radius: 5px;
  outline: 1px solid #d3bb8f;
  outline-offset: -5px;
}

.output-header {
  display: flex;
  align-items: center;
  justify-items: center;
}

.output-title {
  font-size: min(calc(14vw / 5), 20px);
  color: #d3bb8f;
  margin: min(calc(11vw / 5), 16px);
}

.output-inner-area {
  margin: 0px min(calc(14vw / 5), 20px) min(calc(14vw / 5), 20px);
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-wrap: wrap;
}

.distribution-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.distribution-area-title {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

.distribution-result-inner-area {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.distribution-img {
  margin: 0px min(calc(4vw / 5), 8px) min(calc(9vw / 5), 16px);

  width: min(calc(200vw / 5), 500px);
  height: auto;
}

.distribution-result-area {
  margin-bottom: min(calc(9vw / 5), 16px);
  width: fit-content;
  height: fit-content;
}

.range-slider {
  margin-bottom: 5px;

  display: flex;
  align-items: center;
}

.range-slider input[type="range"] {
  width: min(calc(60vw / 5), 100px);
}

.bold-space {
  width: min(calc(45vw / 5), 70px);

  text-align: center;
  font-size: min(calc(9vw / 5), 16px);
  background: none;
  border: none;
  color: #fff;
}

.bold-space-label {
  margin: 0px;
  padding: 0px 1px;
  width: min(calc(45vw / 5), 70px);

  text-align: center;
  font-size: min(calc(9vw / 5), 16px);
  background: none;
  border: none;
  color: #fff;
}

.statistics-area p {
  padding: 0px min(calc(9vw / 5), 16px);
  margin-bottom: 0px;

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

.data-table {
  padding: min(calc(11vw / 5), 20px) min(calc(11vw / 5), 20px) 0px;
  margin-bottom: min(calc(9vw / 5), 16px);
  width: fit-content;

  display: flex;
  flex-direction: column;
  border: none;
  overflow: hidden;
  background-color: #495366;
}

.data-table .row {
  display: flex;
  width: 100%;
  border-top: 1px solid #fff;
  transition-duration: 300ms;
}

.data-table .row:last-child {
  border-bottom: 1px solid #fff;
}

.data-table .cell {
  width: min(calc(25vw / 5), 50px);

  flex: 1;
  padding: min(calc(4vw / 5), 8px);
  text-align: center;
  font-size: min(calc(6vw / 5), 12px);
  color: #fff;
  background-color: #4B5368;
}

.data-table .cell:first-child {
  font-weight: bold;
  background-color: #4B5368;
}

.data-table .row:hover {
  transform: translateY(-15%) scale(1.3);
}

.data-table .cell:hover {
  background-color: #424858;
}

.output-update-btn {
  font-size: min(calc(9vw / 5), 16px);
  border: 1px solid;
  border-color: #d3bb8f;
}
</style>