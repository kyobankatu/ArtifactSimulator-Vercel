<template>
  <div class="output-area">
    <div class="output-header">
      <p class="output-title">出力データ</p>
      <button class="info-icon" @click="$emit('show-info')">
        <img src="@/assets/info.webp" alt="Info"/>
      </button>
    </div>
    
    <div class="output-inner-area">
      <div class="distribution-area info-section">
        <p>確率分布</p>
        <!-- 画像表示 -->
        <div class="distribution-inner-area" v-if="distributionImg">
          <img class="distribution-img" :src="distributionImg" alt="Distribution Image" />
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
    kurtosis: [Number, String]
  },
  emits: ["update-output", "show-info"]
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

.distribution-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

.distribution-inner-area {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.distribution-img {
  margin: 0px min(calc(4vw / 5), 8px) min(calc(9vw / 5), 16px);

  width: min(calc(200vw / 5), 500px);
  height: auto;
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