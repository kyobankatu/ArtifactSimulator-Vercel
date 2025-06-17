<template>
  <div class="elixir-area">
    <p class="elixir-title">エリクサー</p>
    <div class="elixir-inner-area">
      <div class="elixir-switch-area info-section">
        <p>エリクサー使用</p>
        <label class="def-switch">
          <input type="checkbox" v-model="elixirEnabled">
          <span class="def-switch-slider"></span>
        </label>
      </div>
      <div class="elixir-option-area info-section">
        <p>指定オプション</p>
        <select class="def-selecter" v-model="selected1">
          <option
            v-for="opt in filteredOptions1"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.text }}
          </option>
        </select>
        <select class="def-selecter" v-model="selected2">
          <option
            v-for="opt in filteredOptions2"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.text }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ElixirArea",
  props: {
    scoreType: String,
    elixir: Boolean,
    elixirOption: Array
  },
  data() {
    return {
      elixirEnabled: false,
      selected1: "atk",
      selected2: "hp",
      optionsByScoreType: {
        atk: [
          { value: "atk%", text: "攻撃力" },
          { value: "crit-dmg", text: "会心ダメージ" },
          { value: "crit-rate", text: "会心率" },
          { value: "atk", text: "その他" }
        ],
        hp: [
          { value: "hp%", text: "HP" },
          { value: "crit-dmg", text: "会心ダメージ" },
          { value: "crit-rate", text: "会心率" },
          { value: "atk", text: "その他" }
        ],
        em: [
          { value: "em%", text: "元素熟知" },
          { value: "crit-dmg", text: "会心ダメージ" },
          { value: "crit-rate", text: "会心率" },
          { value: "atk", text: "その他" }
        ]
      }
    };
  },
  computed: {
    filteredOptions1() {
      return this.optionsByScoreType[this.scoreType];
    },
    filteredOptions2() {
      // 片方で選択されたものを除外
      return this.filteredOptions1.filter(opt => opt.value !== this.selected1 || opt.value == "atk");
    }
  },
  watch: {
    elixirEnabled(newVal) {
      this.$emit('update:elixir', newVal);
    },
    // 片方の選択肢がもう片方と重複した場合、自動で切り替え
    selected1(newVal, oldVal) {
      if (this.selected2 === newVal) {
        this.selected2 = oldVal;
      }
      this.$emit('update:elixirOption', [this.selected1, this.selected2]);
    },
    selected2() {
      this.$emit('update:elixirOption', [this.selected1, this.selected2]);
    },
    // scoreTypeが変わったら選択肢をリセット
    scoreType() {
      const opts = this.filteredOptions1;
      this.selected1 = opts[0].value;
      this.selected2 = opts[1].value;
      this.$emit('update:elixirOption', [this.selected1, this.selected2]);
    }
  },
  mounted() {
    const opts = this.filteredOptions1;
    this.selected1 = opts[0].value;
    this.selected2 = opts[1].value;
    this.$emit('update:elixir', this.elixirEnabled);
    this.$emit('update:elixir_option', [this.selected1, this.selected2]);
  },
}
</script>

<style scoped>
.elixir-title {
  font-size: min(calc(14vw / 5), 20px);
  color: #d3bb8f;
  margin: min(calc(11vw / 5), 16px);
}

.elixir-area {
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

.elixir-inner-area {
  margin: 0px min(calc(14vw / 5), 20px);
  margin-bottom: min(calc(14vw / 5), 20px);

  display: flex;
  align-items: flex-start;
  justify-items: center;
  gap: min(calc(11vw / 5), 16px);
}

.info-section p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

.elixir-switch-area {
  padding-bottom: min(calc(5vw / 5), 8px);
}
</style>