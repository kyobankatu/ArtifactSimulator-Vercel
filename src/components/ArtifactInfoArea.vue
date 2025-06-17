<template>
  <div class="artifact-info-area">
    <p class="artifact-info-title">オプション選択</p>
    <div v-if="artifactImg">
      <img class="artifact-img" :src="artifactImg" alt="Selected Image" />
    </div>
    <div class="artifact-info-inner-area">
      <div class="option-area">
        <div class="option-num-area info-section">
          <p>サブオプション数</p>
          <input class="visually-hidden" type="radio" name="option" value="3" id="option-3"
            :checked="option === 3"
            @change="$emit('update:option', 3)" />
          <label for="option-3">3オプション</label>
          <input class="visually-hidden" type="radio" name="option" value="4" id="option-4"
            :checked="option === 4"
            @change="$emit('update:option', 4)" />
          <label for="option-4">4オプション</label>
        </div>
        <div class="main-option-area info-section">
          <p>メインオプション</p>
          <select class="def-selecter" :value="position" @change="$emit('update:position', $event.target.value)">
            <option value="生の花">生の花</option>
            <option value="死の羽">死の羽</option>
            <option value="時の砂">時の砂</option>
            <option value="空の杯">空の杯</option>
            <option value="理の冠">理の冠</option>
          </select>
          <select class="def-selecter" :value="main_op" @change="$emit('update:main_op', $event.target.value)">
            <option
              v-for="option in filteredMainOptions"
              :key="option.value"
              :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>
      <div class="suboption-area info-section">
        <p>サブオプション</p>
        <div class="suboptions def-checkbox">
          <input type="checkbox" id="is-crit-rate" :checked="is_crit_rate" @change="$emit('update:is_crit_rate', $event.target.checked)" />
          <label for="is-crit-rate">会心率</label>
          <input type="checkbox" id="is-crit-dmg" :checked="is_crit_dmg" @change="$emit('update:is_crit_dmg', $event.target.checked)" />
          <label for="is-crit-dmg">会心ダメージ</label>
          <input type="checkbox" id="is-atk" :checked="is_atk" @change="$emit('update:is_atk', $event.target.checked)" />
          <label for="is-atk">攻撃力</label>
          <input type="checkbox" id="is-hp" :checked="is_hp" @change="$emit('update:is_hp', $event.target.checked)" />
          <label for="is-hp">HP</label>
          <input type="checkbox" id="is-em" :checked="is_em" @change="$emit('update:is_em', $event.target.checked)" />
          <label for="is-em">元素熟知</label>
        </div>
      </div>
      <div class="reinforce-num-area info-section">
        <p>強化回数</p>
        <select class="def-selecter" :value="count" @change="$emit('update:count', Number($event.target.value))">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArtifactInfoArea",
  props: {
    artifactImg: String,
    option: Number,
    position: String,
    main_op: String,
    filteredMainOptions: Array,
    is_crit_rate: Boolean,
    is_crit_dmg: Boolean,
    is_atk: Boolean,
    is_hp: Boolean,
    is_em: Boolean,
    count: Number
  }
}
</script>

<style scoped>
.artifact-info-title {
  font-size: min(calc(14vw / 5), 20px);
  color: #d3bb8f;
  margin: min(calc(11vw / 5), 16px);
}

.artifact-info-area {
  margin-bottom: 20px;
  width: fit-content;
  max-width: 90%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  background-color: #424858;
  border-radius: 5px;
  outline: 1px solid #d3bb8f;
  outline-offset: -5px;
}

.artifact-info-inner-area {
  margin: 0px min(calc(14vw / 5), 20px) min(calc(14vw / 5), 20px);
  width: fit-content;
  height: fit-content;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  flex-wrap: wrap;
}

.artifact-img {
  margin-bottom: min(calc(22vw / 5), 30px);

  width: min(calc(150vw / 5), 320px);
  height: auto;

  box-shadow: 5px 5px 5px rgb(0 0 0 / 70%);
}

.option-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: min(calc(22vw / 5), 30px);
}

.option-num-area label {
  margin: 0px min(calc(9vw / 5), 16px) min(calc(9vw / 5), 16px);
  padding-left: min(calc(22vw / 5), 30px);

  position: relative;
  cursor: pointer;
  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
  transition: background-color 0.3s, transform 0.2s ease-in-out; /* ホバー時のアニメーション */
}

.option-num-area input[type="radio"] {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: min(calc(9vw / 5), 16px);
  height: min(calc(9vw / 5), 16px);
  opacity: 0; /* ラジオボタンを非表示に */
  pointer-events: none; /* ユーザーがクリックできないように */
}

.option-num-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

/* option-num-areaのアニメーション */

.option-num-area label::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: min(calc(9vw / 5), 16px);
  height: min(calc(9vw / 5), 16px);
  border: 2px solid #fff;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.3s ease; /* アニメーション */
}

.option-num-area label::after {
  content: "";
  position: absolute;
  left: calc(2px + min(calc(9vw / 5), 16px) * 0.1);
  top: 50%;
  transform: translateY(-50%);
  width: calc(min(calc(9vw / 5), 16px) * 0.8);
  height: calc(min(calc(9vw / 5), 16px) * 0.8);
  border-radius: 50%;
  background-color: #fff;
  opacity: 0; /* 初期状態では非表示 */
  transition: all 0.3s ease; /* アニメーション */
}

.option-num-area input[type="radio"]:checked + label::after {
  opacity: 1; /* チェック時に〇を表示 */
}

.option-num-area #option-3:not(:checked) + label::after {
  opacity: 0; /* 未選択状態で非表示 */
  transform: translateY(100%);
}

.option-num-area #option-4:not(:checked) + label::after {
  opacity: 0; /* 未選択状態で非表示 */
  transform: translateY(-100%);
}

.option-num-area input[type="radio"]:checked + label::before {
  background-color: #4B5368; /* チェック時の背景色 */
  transform: translateY(-50%) scale(1.2); /* チェック時に少し拡大 */
}

.option-num-area label:hover {
  background-color: rgba(255, 255, 255, 0); /* ホバー時の背景色 */
  transform: translateY(-2px); /* ホバー時に少し浮き上がる */
}

.option-num-area label:hover::before {
  transform: translateY(-50%) scale(1.1); /* ホバー時にラジオボタンが少し大きくなる */
}

.option-num-area input[type="radio"]:checked + label {
  color: #d3bb8f; /* チェックされたラベルの文字色 */
}

.visually-hidden {
  position: absolute;
  white-space: nowrap;
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  overflow: hidden;
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
}

/* ここまでアニメーション */

.main-option-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

.suboption-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

.suboptions {
  padding: 0px min(calc(9vw / 5), 16px) min(calc(9vw / 5), 16px);
}

.reinforce-num-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

</style>