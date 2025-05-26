<template>
  <body>
    <div class="app">
      <OverlayLoading
        :loading="loading"
        :paimonImg="paimonImg"
        :loading_msg="loading_msg"
        :images="images"
        :opacities="opacities"
      />

      <OverlayInfo
        :show_scan_info="show_scan_info"
        :show_data_info="show_data_info"
        :show_info_box="show_info_box"
        :show_close_button="show_close_button"
        @close-scan-info="scanInfo(false)"
        @close-data-info="dataInfo(false)"
      />
      
      <ArtifactImport
        :fileName="fileName"
        @file-change="handleFileChange"
        @scan-image="scanImage"
        @show-info="scanInfo(true)"
      />
      
      <div class="input-area">
        <ArtifactInfoArea
          :artifactImg="artifactImg"
          :option="option"
          :position="position"
          :main_op="main_op"
          :filteredMainOptions="filteredMainOptions"
          :is_crit_rate="is_crit_rate"
          :is_crit_dmg="is_crit_dmg"
          :is_atk="is_atk"
          :is_hp="is_hp"
          :is_em="is_em"
          :count="count"
          @update:option="option = $event"
          @update:position="position = $event"
          @update:main_op="main_op = $event"
          @update:is_crit_rate="is_crit_rate = $event"
          @update:is_crit_dmg="is_crit_dmg = $event"
          @update:is_atk="is_atk = $event"
          @update:is_hp="is_hp = $event"
          @update:is_em="is_em = $event"
          @update:count="count = $event"
        />

        <ScoreInfoArea
          :score_type="score_type"
          :initScore_formatted="initScore_formatted"
          :searchScore_formatted="searchScore_formatted"
          @update:score_type="score_type = $event"
          @updateInitScore="updateInitScore"
          @updateSearchScore="updateSearchScore"
        />
      </div>

      <OutputArea
        :distributionImg="distributionImg"
        :percentile="percentile"
        :average="average"
        :variance="variance"
        :skewness="skewness"
        :kurtosis="kurtosis"
        @update-output="updateOutput"
        @show-info="dataInfo(true)"
      />
    </div>
  </body>
</template>

<script>
import axios from 'axios';
import paimon_def from "@/assets/paimon.webp";
import paimon_suc from "@/assets/paimon-success.webp";
import paimon_fail from "@/assets/paimon-failed.webp";
import OverlayLoading from './components/OverlayLoading.vue';
import OverlayInfo from './components/OverlayInfo.vue';
import ArtifactImport from './components/ArtifactImport.vue';
import ArtifactInfoArea from './components/ArtifactInfoArea.vue';
import ScoreInfoArea from './components/ScoreInfoArea.vue';
import OutputArea from './components/OutputArea.vue';

export default {
  name: 'App',
  components: {
    OverlayLoading,
    OverlayInfo,
    ArtifactImport,
    ArtifactInfoArea,
    ScoreInfoArea,
    OutputArea
  },
  data() {
    return {
      show_scan_info: false,
      show_data_info: false,
      show_info_box: false,
      show_close_button: false,
      loading: false, // ロード状態フラグ
      scanning: false, // スキャン中のフラグ
      paimonImg: paimon_def, // ロード中パイモン
      loading_msg: "パイモンが計算中...", // 初期メッセージ
      images: [
        require('@/assets/artifact-0.webp'),
        require('@/assets/artifact-1.webp'),
        require('@/assets/artifact-2.webp'),
        require('@/assets/artifact-3.webp'),
        require('@/assets/artifact-4.webp'),
      ],
      mainOptions: {
        "生の花": [
          { value: "hp", text: "HP実数値" },
        ],
        "死の羽": [
          { value: "atk", text: "攻撃力実数値" },
        ],
        "時の砂": [
          { value: "hp%", text: "HP%" },
          { value: "atk%", text: "攻撃力%" },
          { value: "def%", text: "防御力%" },
          { value: "er", text: "元素チャージ効率" },
          { value: "em", text: "元素熟知" },
        ],
        "空の杯": [
          { value: "atk%", text: "攻撃力%" },
          { value: "hp%", text: "HP%" },
          { value: "def%", text: "防御力%" },
          { value: "em", text: "元素熟知" },
          { value: "element", text: "元素ダメージ" },
          { value: "physical", text: "物理ダメージ" },
        ],
        "理の冠": [
          { value: "atk%", text: "攻撃力%" },
          { value: "hp%", text: "HP%" },
          { value: "def%", text: "防御力%" },
          { value: "em", text: "元素熟知" },
          { value: "crit-rate", text: "会心率" },
          { value: "crit-dmg", text: "会心ダメージ" },
          { value: "heal", text: "治療効果" },
        ],
      },
      opacities: [0, 0, 0, 0, 0],
      intervalId: null, // インターバルID
      artifactImg: null, // スキャンした画像URLを保存するための変数
      selectedFile: null, // 選択したファイルを保持
      fileName: '', // ファイル名を保持
      initScore: 0,
      initScore_formatted: "0.0",
      searchScore: 40,
      searchScore_formatted: "40.0",
      option: 3,
      position: "生の花",
      main_op: "atk",
      is_crit_rate: false, // 会心率のフラグ
      is_crit_dmg: false,  // 会心ダメージのフラグ
      is_atk: false,       // 攻撃力のフラグ
      is_hp: false,       // HPのフラグ
      is_em: false,       // 熟知のフラグ
      count: 1,            // 強化回数
      score_type: "atk",   // スコア計算方法
      level: 0, // レベル
      distributionImg: null,  // 確率分布のグラフ
      percentile: [["100.0", "0"], ["0", "0"], ["25", "0"], ["50", "0"], ["75", "0"], ["100", "0"]],
      average: 0,   // 平均
      variance: 0,   // 分散
      skewness: 0,   // 歪度
      kurtosis: 0,   // 尖度
    };
  },

  computed: {
    // position に基づいて main_op をフィルタリング
    filteredMainOptions() {
      return this.mainOptions[this.position];
    },
  },

  watch: {
    // position が変更されたら main_op をリセット
    position(pos) {
      if (this.scanning) {
        this.scanning = false;
      } else {
        this.main_op = this.mainOptions[pos][0].value; // 配列の最初の要素を設定
      }
    },
  },

  mounted() {
    // 初期化時に main_op を最初の値に設定
    this.main_op = this.mainOptions[this.position][0].value;
  },

  methods: {
    scanInfo(open) {
      if (open) {
        this.show_scan_info = true;
        this.show_close_button = true;
        setTimeout(() => {
          this.show_info_box = true;
        }, 100);
      } else {
        this.show_info_box = false;
        setTimeout(() => {
          this.show_close_button = false;
          this.show_scan_info = false;
        }, 400);
      }
    },

    dataInfo(open) {
      if (open) {
        this.show_data_info = true;
        this.show_close_button = true;
        setTimeout(() => {
          this.show_info_box = true;
        }, 100);
      } else {
        this.show_info_box = false;
        setTimeout(() => {
          this.show_close_button = false;
          this.show_data_info = false;
        }, 400);
      }
    },

    handleFileChange(event) {
      // ファイル選択時に呼ばれる
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.selectedFile = file;
        this.fileName = file.name; // ファイル名を表示
        // 画像データをURLとして表示
        const artifactImg = URL.createObjectURL(file);
        this.artifactImg = artifactImg;
      } else {
        alert('画像ファイルを選択してください');
      }
    },

    async scanImage() {
      if (!this.selectedFile) {
        alert('画像を選択してください');
        return;
      }
      
      this.loading = true;
      this.scanning = true;

      this.paimonImg = paimon_def; // 初期状態の画像に設定
      this.loading_msg = "パイモンが計算中...";
      // 開始時にインターバルをセット
      this.startOpacityAnimation();

      const formData = new FormData();
      // 画像を 'image' という名前で追加
      formData.append('image', this.selectedFile);
      // スコア計算方法を 'score_type' という名前で追加
      formData.append('score_type', this.score_type);

      try {
        // POSTリクエストを送信
        const response = await axios.post('https://artifact-simulator-docker.onrender.com/scan-img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'json', // JSON形式でレスポンスを取得
        });

        // 各種数値を変更
        const data = response.data;

        this.initScore = data.init;
        this.initScore_formatted = this.initScore.toFixed(1);
        this.is_atk = data.is_atk;
        this.is_hp = data.is_hp;
        this.is_em = data.is_em;
        this.is_crit_rate = data.is_crit_rate;
        this.is_crit_dmg = data.is_crit_dmg;
        this.option = data.option;
        this.position = data.position
        this.main_op = data.main_op;
        this.score_type = data.score_type;
        this.level = data.level;

        // チェックボックスやスライダーの値を更新
        const atk_box = document.getElementById('is-atk');
        const hp_box = document.getElementById('is-hp');
        const em_box = document.getElementById('is-em');
        const crit_rate_box = document.getElementById('is-crit-rate');
        const crit_dmg_box = document.getElementById('is-crit-dmg');
        const init_slider = document.getElementById('init-slider');
        const option_3 = document.getElementById('option-3');
        const option_4 = document.getElementById('option-4');

        // チェックボックスの状態を設定
        atk_box.checked = this.is_atk
        hp_box.checked = this.is_hp
        em_box.checked = this.is_em
        crit_rate_box.checked = this.is_crit_rate
        crit_dmg_box.checked = this.is_crit_dmg

        // スライダーの値を設定
        init_slider.value = this.initScore;

        // ドロップダウンの値を設定
        if (this.option == 3){
          option_3.checked = true
          option_4.checked = false
        } else {
          option_3.checked = false
          option_4.checked = true
        }

        // レベルによって強化回数を設定
        this.count = 5 - Math.floor(this.level / 4);
        if (this.count == 0) {
          this.count = 1; // レベルが0の場合は1に設定
        }

        // 成功した場合の画像変更
        this.paimonImg = paimon_suc;
        this.updateLoadingMsg(false);
      } catch (error) {
        console.error('画像スキャンに失敗しました:', error);

        // 失敗した場合の画像変更
        this.paimonImg = paimon_fail;
        this.updateLoadingMsg(true);
      } finally {
        this.stopOpacityAnimation();
        // 1秒後にloadingをfalseに設定
        setTimeout(() => {
          this.loading = false;
          this.opacities = [0, 0, 0, 0, 0]
        }, 2000);
      }
    },

    // ローディング中のアニメーションを開始
    startOpacityAnimation() {
      this.opacities = [0, 0, 0, 0, 0]
      let index = 0;
      this.intervalId = setInterval(() => {
        if (index < this.opacities.length) {
          this.opacities[index] = 1;
          index++;
        } else {
          this.opacities = [0, 0, 0, 0, 0]
          index = 0;
        }
      }, 500);
    },

    // ローディング終了時にアニメーションを停止
    stopOpacityAnimation() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.opacities = [1, 1, 1, 1, 1]
      }
    },

    async updateOutput() {
      try {
        // リクエストボディの作成
        const requestBody = {
          option: this.option,
          main_op: this.main_op,
          crit_dmg: this.is_crit_dmg,
          crit_rate: this.is_crit_rate,
          atk: this.is_atk,
          hp: this.is_hp,
          em: this.is_em,
          init: this.initScore,
          score: this.searchScore,
          count: this.count,
          score_type: this.score_type,
        };

        this.loading = true;

        this.paimonImg = paimon_def; // 初期状態の画像に設定
        this.loading_msg = "パイモンが計算中...";
        // 開始時にインターバルをセット
        this.startOpacityAnimation();

        // POSTリクエストを送信
        const response_dist = await axios.post('https://artifact-simulator-docker.onrender.com/get-dist', requestBody, {
          responseType: 'blob', // 画像データを受け取る
        });

        // Blobから画像URLを生成
        const distImg = URL.createObjectURL(response_dist.data);

        // 画像を更新
        this.distributionImg = distImg;

        console.log('画像を更新しました。');

        // POSTリクエストを送信
        const response_data = await axios.post('https://artifact-simulator-docker.onrender.com/get-data', requestBody, {
          responseType: 'json', // JSON形式でレスポンスを取得
        });

        const data = response_data.data

        this.percentile = data.percentile
        this.average = data.average
        this.variance = data.variance
        this.skewness = data.skewness
        this.kurtosis = data.kurtosis

        // 成功した場合の画像変更
        this.paimonImg = paimon_suc;
        this.updateLoadingMsg(false);
      } catch (error) {
        console.log(error);
        // 失敗した場合の画像変更
        this.paimonImg = paimon_fail;
        this.updateLoadingMsg(true);
      } finally {
        this.stopOpacityAnimation();
        // 1秒後にloadingをfalseに設定
        setTimeout(() => {
          this.loading = false;
          this.opacities = [0, 0, 0, 0, 0]
        }, 2000);
      }
    },

    updateInitScore(value) {
      // スライダーの値を更新
      let tmp_score = parseFloat(value, 10);
      tmp_score = Math.floor(tmp_score * 10) / 10;
      if (!isNaN(tmp_score)) {
        this.initScore = 0;
      } if (tmp_score < 0) {
        this.initScore = 0;
      } else if (tmp_score > 65) {
        this.initScore = 65
      } else {
        this.initScore = tmp_score
      }
      this.initScore_formatted = this.initScore.toFixed(1);
    },

    updateSearchScore(value) {
      // スライダーの値を更新
      let tmp_score = parseFloat(value, 10);
      tmp_score = Math.floor(tmp_score * 10) / 10;
      if (!isNaN(tmp_score)) {
        this.searchScore = 0;
      } if (tmp_score < 0) {
        this.searchScore = 0;
      } else if (tmp_score > 65) {
        this.searchScore = 65
      } else {
        this.searchScore = tmp_score
      }
      this.searchScore_formatted = this.searchScore.toFixed(1);
    },

    updateLoadingMsg(is_failed) {
      const msg_success = ["オイラなら余裕だぜ！", "えっへん！", "ふぅ...やっと終わったぜ...", "オイラわかったぞ！"]
      const msg_fail = ["わ、わからないぞ...", "うーん...わからないぜ！", "ん？どういうことだ？"]
      if (is_failed) {  // 失敗時
        const random = Math.floor(Math.random() * msg_fail.length);
        this.loading_msg = msg_fail[random];
      } else {  // 成功時
        const random = Math.floor(Math.random() * msg_success.length);
        this.loading_msg = msg_success[random];
      }
    }
  },
};
</script>

<style>

* {
  font-family: Genshin;
}

body {
  margin: 0;
  padding: 0;
  height: fit-content;
  width: 100vw;

  background-image: url(./assets/background.png);
  background-repeat: repeat;
  background-size: calc(200vw / 5) calc(200vw / 5);
}

.app {
  padding-top: min(calc(50vh / 5), 50px);
  height: fit-content;

  display: flex;
  flex-direction: column; /* 上下方向に要素を並べる */
  align-items: center; /* 子要素を水平方向に中央寄せ */
}

/* オーバーレイ */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7); /* 半透明白背景 */
  backdrop-filter: blur(5px); /* ブラー効果 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  visibility: hidden;
}

.overlay p {
  margin: min(calc(9vw / 5), 16px) 0px;
  font-size: min(calc(15vw / 5), 24px);
  color: #555;
}

/* ロード状態の表示切り替え */
.overlay.active {
  visibility: visible;
}

/* infoボタン */
.info-icon {
  padding: 0px;
  margin: 0px;
  width: min(calc(20vw / 5), 30px);
  height: min(calc(20vw / 5), 30px);
  
  visibility: hidden;
}

.info-icon img {
  width: auto;
  height: 100%;

  border-radius: 50%;
  border: #d3bb8f solid 1px;
  box-shadow: 3px 5px 5px rgb(0 0 0 / 70%);

  transition-duration: 100ms;
  visibility: visible;
}

/* 基本的なボタンスタイル */
.def-button {
  padding: min(calc(6vw / 5), 10px) min(calc(14vw / 5), 20px);
  width: fit-content;

  background-color: #4B5368;
  color: white;
  border-radius: 5px;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  user-select: none;
  box-shadow: 0 3px 5px rgb(0 0 0 / 50%);
  white-space: nowrap;

  transition-duration: 100ms;
}

.def-button:hover, .info-icon img:hover {
  background-color: #424858;
  transform: scale(0.99, 0.99) translateY(2px);
}

/* 値入力エリア */
.input-area {
  margin: 0px min(calc(14vw / 5), 20px) min(calc(14vw / 5), 20px);
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: min(calc(14vw / 5), 20px);
  flex-wrap: wrap;
}

/* 基本的な情報ボックス */
.info-section {
  width: fit-content;
  height: fit-content;

  display: flex;
  flex-direction: column; /* ラジオボタンを縦に並べる */
  justify-items: center;
  align-items: center;

  background-color: #495366;
  box-shadow: 3px 5px 5px rgb(0 0 0 / 70%);
}

/* 基本的なセレクトボックス */
.def-selecter {
  padding: min(calc(5vw / 5), 8px);
  margin: 0px min(calc(9vw / 5), 16px) min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  background-color: #4B5368;
  color: #d3bb8f;
  border-radius: 5px;
  border: none;
  outline: none;
  cursor: pointer;
  width: 80%;
  appearance: none;
  transition: background-color 0.3s ease;
}

/* def-selecterのアニメーション */

.def-selecter:hover {
  background-color: #424858;
}

.def-selecter:focus {
  background-color: #3a404f;
  border: 1px solid #d3bb8f;
}

/* セレクトボックスの矢印 */
.def-selecter::-ms-expand {
  display: none;
}

.def-selecter option {
  background-color: #4B5368;
  color: white;
}

/* ここまでアニメーション */

</style>
