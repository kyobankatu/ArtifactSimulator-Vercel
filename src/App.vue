<template>
  <body>
    <div id="app">
      <!-- オーバーレイでブラー表示 -->
      <div :class="['overlay', { active: loading }]">
        <img id="paimon-img" :src="paimonImg">
        <p>{{ loading_msg }}</p>
        <div class="loading-artifact-container">
          <img
            v-for="(img, index) in images"
            :key="index"
            :src="img"
            class="loading-artifact-img"
            :style="{ opacity: opacities[index] }"
          />
        </div>
      </div>

      <div :class="['overlay', { active: show_scan_info }]">
        <button v-if="show_close_button" class="def-button info-close-button" style="font-size: min(calc(9vw / 5), 16px);" @click="scanInfo(false)">閉じる</button>
        <div :class="['info-box', { 'show': show_info_box }]">
          <p style="font-size: min(calc(14vw / 5), 20px); color: #d3bb8f; margin: min(calc(11vw / 5), 16px);">
            聖遺物のインポートについて
          </p>
          <div class="info-inner-box">
            <p>聖遺物の画像を基に、サブオプション等の情報を自動で入力します。</p>
            <p>※ 手動で入力することも可能です。</p>
            <p>聖遺物の画像は、<span style="color: #ff6f61;">メインオプションとサブオプションのみが見える</span>様に切り取った上で、アップロードして下さい。
              聖遺物のセット効果を含めた画像を使用した場合、誤った情報を入力する可能性があります。</p>
            <p style="text-align: center;">切り取った画像の例</p>
            <img src="./assets/artifact-sample.webp" alt="Info" style="width: 40%; height: auto; max-width: 300px; margin-bottom: min(calc(11vw / 5), 20px);"/>
            <p>また、<span style="color: #ff6f61;">スキャンを行う前に、スコア計算方法を確認</span>してください。誤ったスコア計算方法が選択されていると、正しい初期スコアが入力されません。</p>
            <p>※ 正しく画像をインポートした場合でも、画質やその他の要因によって正しく読み取れない可能性があります。</p>
          </div>
        </div>
      </div>

      <div :class="['overlay', { active: show_data_info }]">
        <button v-if="show_close_button" class="def-button info-close-button" style="font-size: min(calc(9vw / 5), 16px);" @click="dataInfo(false)">閉じる</button>
        <div :class="['info-box', { 'show': show_info_box }]">
          <p style="font-size: min(calc(14vw / 5), 20px); color: #d3bb8f; margin: min(calc(11vw / 5), 16px);">
            出力データについて
          </p>
          <div class="info-inner-box">
            <p>聖遺物の情報を基に、予想スコアの分布を計算します。</p>
            <p>画面右側にある<span style="color: #4fc3f7;">「更新」ボタン</span>を押すことで、予想スコアの分布および各種統計量を出力します。</p>
            <p style="text-align: center;">確率分布の例</p>
            <img src="./assets/distribution-sample.webp" alt="Info" style="width: 60%; height: auto; margin-bottom: min(calc(9vw / 5), 16px);"/>
            <p>縦軸は確率（％表記ではない）を、横軸は最終スコアを表しています。</p>
            <p>※ 計算の過程で、極度に出現確率が少ない例については削除されているので、確率の総和は必ずしも１にはなりません。</p>
            <p><span style="color: #4fc3f7;">「データ表」</span>では各種統計量を表形式で出力します。</p>
            <p>上段の表では、１列目に上側〇〇％点を、２列目にそれに対応したスコアを記載。１行目については、<span style="color: #4fc3f7;">「スコア情報」→「調査スコア」</span>にて設定したスコアが上側何％点であるかを表しています。
            </p>
            <p>下段の表では、グラフの形に関する統計量を出力します。</p>
            <ul>
              <li>
                <span style="color:#ffcc66;">平均</span>
                <p>
                  上側５０％点と比較し、大きい場合には分布が低スコアに偏っていると言えます。逆も同様。
                </p>
              </li>
              <li>
                <span style="color:#ffcc66;">分散</span>
                <p>
                  分散が大きい場合には、分布が広範囲に散らばっていると言えます。<br>
                  特に、分散が<span style="color: #ff6f61;">４５より大きい</span>場合には最終スコアの予想がかなり散らばっていると言え、１段階強化した後に改めて出力を行うことでより正確な最終スコアの予想を行えます。
                </p>
              </li>
              <li>
                <span style="color:#ffcc66;">歪度</span>
                <p>
                  分布の歪みを表し、正の値を取る場合には分布が左（低スコア）側に、負の値の場合には分布が右（高スコア）側に歪んでいると言えます。<br>
                  特に、歪度の<span style="color: #ff6f61;">絶対値が０．５より大きい</span>場合には極端な歪みがあり、良い聖遺物あるいは悪い聖遺物となる可能性が高いです。
                </p>
              </li>
              <li>
                <span style="color:#ffcc66;">尖度</span>
                <p>分布の尖り具合を表し、正の値を取る場合には分布が尖っており、負の値の場合には分布が扁平であると言えます。<br>
                  特に、尖度が<span style="color: #ff6f61;">０．５より大きい</span>場合には平均付近に最終スコアの予想が集中しており、平均値とほぼ同じスコアに収束する可能性が高いです。<br>
                  一方で、尖度が<span style="color: #ff6f61;">-０．５より小さい</span>場合には分布が平均付近から散らばっており、平均値から離れた値に収束する可能性が高いです。
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; justify-items: center;">
        <p style="font-size: min(calc(14vw / 5), 20px); color: #3a404f;">聖遺物インポート</p>
        <button class="info-icon" @click="scanInfo(true)">
          <img src="./assets/info.webp" alt="Info"/>
        </button>
      </div>
      
      <!-- ファイル選択と表示フォーム -->
      <div id="img-upload-area">
        <!-- ファイル選択を隠してラベルをクリック可能にする -->
        <label for="artifact-select" class="def-button" style="font-size: min(calc(9vw / 5), 16px);">ファイルを選択</label>
        <input type="file" id="artifact-select" @change="handleFileChange" accept="image/png" style="display: none;"/>
        <input type="text" id="artifact-img-name" :value="fileName" style="font-size: min(calc(9vw / 5), 16px);" readonly placeholder="ファイル名" />
        <button class="def-button" style="font-size: min(calc(9vw / 5), 16px);" @click="scanImage">スキャン</button>
      </div>
      
      <div id="input-area">
        <div id="artifact-info-area">
          <p style="font-size: min(calc(14vw / 5), 20px); color: #d3bb8f; margin: min(calc(11vw / 5), 16px);">オプション選択</p>
          <!-- 画像表示 -->
          <div v-if="artifactImg">
            <img id="artifact-img" :src="artifactImg" alt="Selected Image" />
          </div>
          <div id="artifact-info-inner-area">
            <div id="option-area">
              <div id="option-num-area" class="info-section">
                <p>サブオプション数</p>
                <input class="visually-hidden" type="radio" name="option" value="3" id="option-3" v-model.number="option" />
                <label for="option-3">3オプション</label>
                <input class="visually-hidden" type="radio" name="option" value="4" id="option-4" v-model.number="option" />
                <label for="option-4">4オプション</label>
              </div>
              <div id="main-option-area" class="info-section">
                <p>メインオプション</p>
                <select class="def-selecter" v-model="position">
                  <option value="生の花">生の花</option>
                  <option value="死の羽">死の羽</option>
                  <option value="時の砂">時の砂</option>
                  <option value="空の杯">空の杯</option>
                  <option value="理の冠">理の冠</option>
                </select>
                <select class="def-selecter" v-model="main_op">
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
                <input type="checkbox" id="is-crit-rate" v-model="is_crit_rate"/>
                <label for="is-crit-rate">会心率</label>

                <input type="checkbox" id="is-crit-dmg" v-model="is_crit_dmg"/>
                <label for="is-crit-dmg">会心ダメージ</label>

                <input type="checkbox" id="is-atk" v-model="is_atk"/>
                <label for="is-atk">攻撃力</label>

                <input type="checkbox" id="is-hp" v-model="is_hp"/>
                <label for="is-hp">HP</label>

                <input type="checkbox" id="is-em" v-model="is_em"/>
                <label for="is-em">元素熟知</label>
              </div>
            </div>

            <div id="reinforce-num-area" class="info-section">
              <p>強化回数</p>
              <select class="def-selecter" v-model.number="count">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
        </div>
        <div id="score-info-area">
          <p style="font-size: min(calc(14vw / 5), 20px); color: #d3bb8f; margin: min(calc(11vw / 5), 16px);">スコア情報</p>
          <div id="score-info-inner-area">
            <div id="score-type-area" class="info-section">
              <p>スコア計算方法</p>
              <select class="def-selecter" v-model.number="score_type">
                <option value="atk">攻撃換算</option>
                <option value="hp">HP換算</option>
                <option value="em">熟知換算</option>
              </select>
            </div>
            <div id="slider-area">
              <div id="init-score-area" class="info-section">
                <p>現在のスコア</p>
                <div class="range-slider">
                  <!-- スライダー -->
                  <input
                    type="range"
                    id="init-slider"
                    min="0"
                    max="65"
                    step="0.1"
                    v-model="initScore_formatted"
                    @input="updateInitScore($event.target.value)"
                  />
                  <!-- 値入力欄 -->
                  <input
                    id="init-score"
                    type="number"
                    min="0"
                    max="65"
                    step="0.1"
                    v-model="initScore_formatted"
                    @blur="updateInitScore($event.target.value)"
                  />
                </div>
              </div>
              <div id="search-score-area" class="info-section">
                <p>調査スコア</p>
                <div class="range-slider">
                  <!-- スライダー -->
                  <input
                    type="range"
                    min="0"
                    max="65"
                    step="0.1"
                    v-model="searchScore_formatted"
                    @input="updateSearchScore($event.target.value)"
                  />
                  <!-- 値入力欄 -->
                  <input
                    id="search-score"
                    type="number"
                    min="0"
                    max="65"
                    step="0.1"
                    v-model="searchScore_formatted"
                    @blur="updateSearchScore($event.target.value)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="output-area">
        <div style="display: flex; align-items: center; justify-items: center;">
          <p style="font-size: min(calc(14vw / 5), 20px); color: #d3bb8f; margin: min(calc(11vw / 5), 16px);">出力データ</p>
          <button class="info-icon" @click="dataInfo(true)">
            <img src="./assets/info.webp" alt="Info"/>
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
              <div class="row">
                <div class="cell" id="data-1-1">{{ percentile[0][0] }}%</div>
                <div class="cell" id="data-1-2">{{ percentile[0][1] }}</div>
              </div>
              <div class="row">
                <div class="cell" id="data-2-1">{{ percentile[1][0] }}%</div>
                <div class="cell" id="data-2-2">{{ percentile[1][1] }}</div>
              </div>
              <div class="row">
                <div class="cell" id="data-3-1">{{ percentile[2][0] }}%</div>
                <div class="cell" id="data-3-2">{{ percentile[2][1] }}</div>
              </div>
              <div class="row">
                <div class="cell" id="data-4-1">{{ percentile[3][0] }}%</div>
                <div class="cell" id="data-4-2">{{ percentile[3][1] }}</div>
              </div>
              <div class="row">
                <div class="cell" id="data-5-1">{{ percentile[4][0] }}%</div>
                <div class="cell" id="data-5-2">{{ percentile[4][1] }}</div>
              </div>
              <div class="row">
                <div class="cell" id="data-6-1">{{ percentile[5][0] }}%</div>
                <div class="cell" id="data-6-2">{{ percentile[5][1] }}</div>
              </div>
            </div>
            <div class="data-table">
              <div class="row">
                <div class="cell" id="data-7-1">平均</div>
                <div class="cell" id="data-7-2">{{ average }}</div>
              </div>
              <div class="row">
                <div class="cell" id="data-8-1">分散</div>
                <div class="cell" id="data-8-2">{{ variance }}</div>
              </div>
              <div class="row">
                <div class="cell" id="data-9-1">歪度</div>
                <div class="cell" id="data-9-2">{{ skewness }}</div>
              </div>
              <div class="row">
                <div class="cell" id="data-10-1">尖度</div>
                <div class="cell" id="data-10-2">{{ kurtosis }}</div>
              </div>
            </div>
          </div>
          <button class="def-button" style="font-size: min(calc(9vw / 5), 16px);" @click="updateOutput">更新</button>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import axios from 'axios';
import paimon_def from "@/assets/paimon.webp";
import paimon_suc from "@/assets/paimon-success.webp";
import paimon_fail from "@/assets/paimon-failed.webp";

export default {
  name: 'App',
  data() {
    return {
      show_scan_info: false,
      show_data_info: false,
      show_info_box: false,
      show_close_button: false,
      loading: false, // ロード状態フラグ
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
      this.main_op = this.mainOptions[pos][0].value; // 配列の最初の要素を設定
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

<style scoped>

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

#app {
  padding-top: min(calc(50vh / 5), 50px);
  height: fit-content;

  display: flex;
  flex-direction: column; /* 上下方向に要素を並べる */
  align-items: center; /* 子要素を水平方向に中央寄せ */
}

/* 画面全体にオーバーレイを表示しブラー効果をかける */
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

#paimon-img {
  width: min(calc(100vw / 5), 150px);
  height: auto;
}

.loading-artifact-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.loading-artifact-img {
  width: min(calc(30vw / 5), 50px);
  height: auto;

  opacity: 0.2; /* 初期状態 */
  transition: opacity 0.3s ease-in-out;
}

/* ロード状態の表示切り替え */
.overlay.active {
  visibility: visible;
}

/* 以下、既存のスタイル */
#img-upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

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

#input-area {
  margin: 0px min(calc(14vw / 5), 20px) min(calc(14vw / 5), 20px);
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: min(calc(14vw / 5), 20px);
  flex-wrap: wrap;
}

#artifact-img-name {
  padding: 10px;
  width: min(calc(200vw / 5), 250px);
  
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 14px;
  cursor: not-allowed;
}

#artifact-info-area {
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

#artifact-info-inner-area {
  margin: 0px min(calc(14vw / 5), 20px) min(calc(14vw / 5), 20px);
  width: fit-content;
  height: fit-content;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  flex-wrap: wrap;
}

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

#artifact-img {
  margin-bottom: min(calc(22vw / 5), 30px);

  width: min(calc(150vw / 5), 320px);
  height: auto;

  box-shadow: 5px 5px 5px rgb(0 0 0 / 70%);
}

#option-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: min(calc(22vw / 5), 30px);
}

#option-num-area label {
  margin: 0px min(calc(9vw / 5), 16px) min(calc(9vw / 5), 16px);
  padding-left: min(calc(22vw / 5), 30px);

  position: relative;
  cursor: pointer;
  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
  transition: background-color 0.3s, transform 0.2s ease-in-out; /* ホバー時のアニメーション */
}

#option-num-area input[type="radio"] {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: min(calc(9vw / 5), 16px);
  height: min(calc(9vw / 5), 16px);
  opacity: 0; /* ラジオボタンを非表示に */
  pointer-events: none; /* ユーザーがクリックできないように */
}

#option-num-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

/* option-num-areaのアニメーション */

#option-num-area label::before {
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

#option-num-area label::after {
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

#option-num-area input[type="radio"]:checked + label::after {
  opacity: 1; /* チェック時に〇を表示 */
}

#option-num-area #option-3:not(:checked) + label::after {
  opacity: 0; /* 未選択状態で非表示 */
  transform: translateY(100%);
}

#option-num-area #option-4:not(:checked) + label::after {
  opacity: 0; /* 未選択状態で非表示 */
  transform: translateY(-100%);
}

#option-num-area input[type="radio"]:checked + label::before {
  background-color: #4B5368; /* チェック時の背景色 */
  transform: translateY(-50%) scale(1.2); /* チェック時に少し拡大 */
}

#option-num-area label:hover {
  background-color: rgba(255, 255, 255, 0); /* ホバー時の背景色 */
  transform: translateY(-2px); /* ホバー時に少し浮き上がる */
}

#option-num-area label:hover::before {
  transform: translateY(-50%) scale(1.1); /* ホバー時にラジオボタンが少し大きくなる */
}

#option-num-area input[type="radio"]:checked + label {
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

#main-option-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

#suboption-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

#suboptions {
  padding: 0px min(calc(9vw / 5), 16px) min(calc(9vw / 5), 16px);
}

#suboptions input[type="checkbox"] {
  display: none;
}

#suboptions input[type="checkbox"] + label {
  padding-left: min(calc(26vw / 5), 35px);
  margin: 0px min(calc(22vw / 5), 30px) min(calc(22vw / 5), 30px);

  font-size: min(calc(9vw / 5), 16px);
  display: block;
  position: relative;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
}

#suboptions input[type="checkbox"] + label:before {
  content: '';
  display: block;
  width: min(calc(14vw / 5), 20px);
  height: min(calc(14vw / 5), 20px);
  border: 2px solid #d3bb8f;
  position: absolute;
  left: 0;
  top: 0;
  opacity: .6;
  -webkit-transition: all .12s, border-color .08s;
  transition: all .12s, border-color .08s;
}

#suboptions input[type="checkbox"]:checked + label:before {
  width: min(calc(9vw / 5), 10px);
  top: -5px;
  left: 5px;
  border-radius: 0;
  opacity: 1;
  border-top-color: transparent;
  border-left-color: transparent;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

#reinforce-num-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

#score-info-area {
  margin-bottom: 20px;
  width: fit-content;
  max-width: 80%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  background-color: #424858;
  border-radius: 5px;
  outline: 1px solid #d3bb8f;
  outline-offset: -5px;
}

#score-info-inner-area {
  margin: 0px min(calc(14vw / 5), 20px);

  display: flex;
  align-items: flex-start;
  justify-items: center;
  gap: min(calc(11vw / 5), 16px);
}

#score-type-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

#slider-area {
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

#init-score-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

/* スライダー全体のスタイル */
.range-slider {
  margin-bottom: 5px;

  display: flex;
  align-items: center;
}

/* レンジスライダーのスタイル */
.range-slider input[type="range"] {
  -webkit-appearance: none;
  width: min(calc(100vw / 5), 200px);
  height: min(calc(4vw / 5), 8px);
  background: #383d4b;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
}

/* スライダーのつまみ */
.range-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: min(calc(16vw / 5), 22px);
  height: min(calc(16vw / 5), 22px);
  background: #d3bb8f;
  border: min(calc(2vw / 5), 3px) solid #495366;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.range-slider input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2); /* ホバー時に拡大 */
}

.range-slider input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #d3bb8f;
  border: 1px solid #495366;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.range-slider input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
}

/* 値表示のスタイル */
#init-score {
  width: min(calc(45vw / 5), 70px);

  text-align: center;
  font-size: min(calc(9vw / 5), 16px);
  background: none;
  border: none;
  color: #fff;
}

#search-score-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

#search-score {
  width: min(calc(45vw / 5), 70px);

  text-align: center;
  font-size: min(calc(9vw / 5), 16px);
  background: none;
  border: none;
  color: #fff;
}

#output-area {
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

#artifact-info-inner-area {
  margin: 0px min(calc(14vw / 5), 20px) min(calc(14vw / 5), 20px);
  width: fit-content;
  height: fit-content;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  flex-wrap: wrap;
}

#output-inner-area {
  margin: 0px min(calc(14vw / 5), 20px) min(calc(14vw / 5), 20px);
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-wrap: wrap;
}

#distribution-area p {
  padding: 0px min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  color: #fff;
  white-space: nowrap;
}

#distribution-inner-area {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

#distribution-img {
  margin: 0px min(calc(4vw / 5), 8px) min(calc(9vw / 5), 16px);

  width: min(calc(200vw / 5), 500px);
  height: auto;
}

#statistics-area p {
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


#output-inner-area button {
  border: 1px solid;
  border-color: #d3bb8f;
}

</style>
