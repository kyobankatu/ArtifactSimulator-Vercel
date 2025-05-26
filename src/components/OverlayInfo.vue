<template>
  <div :class="['overlay', { active: show_scan_info }]">
    <button
      v-if="show_close_button"
      class="def-button info-close-button"
      @click="$emit('close-scan-info')">
      閉じる
    </button>
    <div :class="['info-box', { 'show': show_info_box }]">
      <p class="overlay-title">
        聖遺物のインポートについて
      </p>
      <div class="info-inner-box">
        <p>聖遺物の画像を基に、サブオプション等の情報を自動で入力します。</p>
        <p>※ 手動で入力することも可能です。</p>
        <p>
          聖遺物の画像は、
          <span class="emphasis-red">メインオプションとサブオプションのみが見える</span>
          様に切り取った上で、アップロードして下さい。
          聖遺物のセット効果を含めた画像を使用した場合、誤った情報を入力する可能性があります。
        </p>
        <p class="center-text">切り取った画像の例</p>
        <img class="artifact-sample-img" src="@/assets/artifact-sample.webp" alt="Info"/>
        <p>
          また、
          <span class="emphasis-red">スキャンを行う前に、スコア計算方法を確認</span>
          してください。誤ったスコア計算方法が選択されていると、正しい初期スコアが入力されません。
        </p>
        <p>※ 正しく画像をインポートした場合でも、画質やその他の要因によって正しく読み取れない可能性があります。</p>
      </div>
    </div>
  </div>

  <div :class="['overlay', { active: show_data_info }]">
    <button
      v-if="show_close_button"
      class="def-button info-close-button"
      @click="$emit('close-data-info')"
    >閉じる</button>
    <div :class="['info-box', { 'show': show_info_box }]">
      <p class="overlay-title">
        出力データについて
      </p>
      <div class="info-inner-box">
        <p>聖遺物の情報を基に、予想スコアの分布を計算します。</p>
        <p>画面右側にある<span class="emphasis-blue">「更新」ボタン</span>を押すことで、予想スコアの分布および各種統計量を出力します。</p>
        <p class="center-text">確率分布の例</p>
        <img class="distribution-sample-img" src="@/assets/distribution-sample.webp" alt="Info"/>
        <p>縦軸は確率（％表記ではない）を、横軸は最終スコアを表しています。</p>
        <p>※ 計算の過程で、極度に出現確率が少ない例については削除されているので、確率の総和は必ずしも１にはなりません。</p>
        <p><span class="emphasis-blue">「データ表」</span>では各種統計量を表形式で出力します。</p>
        <p>
          上段の表では、１列目に上側〇〇％点を、２列目にそれに対応したスコアを記載。１行目については、
          <span class="emphasis-blue">「スコア情報」→「調査スコア」</span>
          にて設定したスコアが上側何％点であるかを表しています。
        </p>
        <p>下段の表では、グラフの形に関する統計量を出力します。</p>
        <ul>
          <li>
            <span class="emphasis-yellow">平均</span>
            <p>
              上側５０％点と比較し、大きい場合には分布が低スコアに偏っていると言えます。逆も同様。
            </p>
          </li>
          <li>
            <span class="emphasis-yellow">分散</span>
            <p>
              分散が大きい場合には、分布が広範囲に散らばっていると言えます。<br>
              特に、分散が<span class="emphasis-red">４５より大きい</span>場合には最終スコアの予想がかなり散らばっていると言え、１段階強化した後に改めて出力を行うことでより正確な最終スコアの予想を行えます。
            </p>
          </li>
          <li>
            <span class="emphasis-yellow">歪度</span>
            <p>
              分布の歪みを表し、正の値を取る場合には分布が右（高いスコア）側に、負の値の場合には分布が左（低スコア）側に歪んでいると言えます。<br>
              特に、歪度の<span class="emphasis-red">絶対値が０．５より大きい</span>場合には極端な歪みがあり、良い聖遺物あるいは悪い聖遺物となる可能性が高いです。
            </p>
          </li>
          <li>
            <span class="emphasis-yellow">尖度</span>
            <p>
              分布の尖り具合を表し、正の値を取る場合には分布が尖っており、負の値の場合には分布が扁平であると言えます。<br>
              特に、尖度が<span class="emphasis-red">０．５より大きい</span>場合には平均付近に最終スコアの予想が集中しており、平均値とほぼ同じスコアに収束する可能性が高いです。<br>
              一方で、尖度が<span class="emphasis-red">-０．５より小さい</span>場合には分布が平均付近から散らばっており、平均値から離れた値に収束する可能性が高いです。
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OverlayInfo",
  props: {
    show_scan_info: Boolean,
    show_data_info: Boolean,
    show_info_box: Boolean,
    show_close_button: Boolean
  },
  emits: ["close-scan-info", "close-data-info"]
}
</script>

<style scoped>

/* 説明欄初期状態 */
.info-box {
  max-height: 0px;
  max-width: 80%;
  height: fit-content;
  width: fit-content;
  padding: 10px;

  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  background-color: #424858;
  border-radius: 5px;
  outline: 1px solid #d3bb8f;
  outline-offset: -5px;

  transition: max-height 300ms ease-in-out;
}

/* 説明欄表示状態 */
.info-box.show {
  max-height: 70%;
  padding: 10px;
}

.info-close-button {
  margin-bottom: min(calc(14vw / 5), 20px);
}

.info-inner-box {
  margin: 0px min(calc(30vw / 5), 40px) min(calc(30vw / 5), 40px);

  overflow-x: hidden;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.info-inner-box p, .info-inner-box li{
  margin: 0px 0px min(calc(9vw / 5), 16px);
  width: 100%;

  text-align: left;
  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
}

.overlay-title {
  font-size: min(calc(14vw / 5), 20px);
  color: #d3bb8f;
  margin: min(calc(11vw / 5), 16px);
}

.artifact-sample-img {
  width: 40%;
  height: auto;
  max-width: 300px;
  margin-bottom: min(calc(11vw / 5), 20px);
}

.distribution-sample-img {
  width: 60%;
  height: auto;
  margin-bottom: min(calc(9vw / 5), 16px);
}

.center-text {
  text-align: center;
}

.emphasis-red {
  color: #ff6f61;
}

.emphasis-blue {
  color: #4fc3f7;
}

.emphasis-yellow {
  color: #ffcc66;
}
</style>