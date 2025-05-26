<template>
  <div id="artifact-info-area">
    <p style="font-size: min(calc(14vw / 5), 20px); color: #d3bb8f; margin: min(calc(11vw / 5), 16px);">オプション選択</p>
    <div v-if="artifactImg">
      <img id="artifact-img" :src="artifactImg" alt="Selected Image" />
    </div>
    <div id="artifact-info-inner-area">
      <div id="option-area">
        <div id="option-num-area" class="info-section">
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
        <div id="main-option-area" class="info-section">
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
      <div id="suboption-area" class="info-section">
        <p>サブオプション</p>
        <div id="suboptions">
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
      <div id="reinforce-num-area" class="info-section">
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