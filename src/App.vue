<template>
  <body>
    <div id="app">
      <p style="font-size: min(calc(14vw / 5), 20px); color: #3a404f;">聖遺物インポート</p>
      
      <!-- ファイル選択と表示フォーム -->
      <div id="img-upload-area">
        <!-- ファイル選択を隠してラベルをクリック可能にする -->
        <label for="artifact-select" class="def-button" style="font-size: min(calc(9vw / 5), 16px);">ファイルを選択</label>
        <input type="file" id="artifact-select" @change="handleFileChange" accept="image/png" style="display: none;"/>
        <input type="text" id="artifact-img-name" :value="fileName" style="font-size: min(calc(9vw / 5), 16px);" readonly placeholder="ファイル名" />
        <button class="def-button" style="font-size: min(calc(9vw / 5), 16px);" @click="scanImage">スキャン</button>
      </div>

      <div id="artifact-info-area">
        <p style="font-size: min(calc(14vw / 5), 20px); color: #d3bb8f; margin: min(calc(11vw / 5), 16px);">オプション選択</p>
        <!-- 画像表示 -->
        <div v-if="imageUrl">
          <img id="artifact-img" :src="imageUrl" alt="Selected Image" />
        </div>
        <div id="artifact-info-inner-area">
          <div id="option-num-area" class="info-section">
            <p>初期オプション数</p>
            <input class="visually-hidden" type="radio" name="option" value="3" id="option-3" />
            <label for="option-3">3オプション</label>
            <input class="visually-hidden" type="radio" name="option" value="4" id="option-4" />
            <label for="option-4">4オプション</label>
          </div>

          <div id="suboption-area" class="info-section">
            <p>サブオプション</p>
            <div id="suboptions">
              <input type="checkbox" id="box-1">
              <label for="box-1">会心率</label>

              <input type="checkbox" id="box-2" checked>
              <label for="box-2">会心ダメージ</label>

              <input type="checkbox" id="box-3">
              <label for="box-3">攻撃力</label>
            </div>
          </div>

          <div id="reinforce-num-area" class="info-section">
            <p>強化回数</p>
            <select id="reinforce-select">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      imageUrl: null, // スキャンした画像URLを保存するための変数
      selectedFile: null, // 選択したファイルを保持
      fileName: '', // ファイル名を保持
    };
  },
  methods: {
    handleFileChange(event) {
      // ファイル選択時に呼ばれる
      const file = event.target.files[0];
      if (file && file.type === 'image/png') {
        this.selectedFile = file;
        this.fileName = file.name; // ファイル名を表示
        // 画像データをURLとして表示
        const imageUrl = URL.createObjectURL(file);
        this.imageUrl = imageUrl;
      } else {
        alert('PNG画像を選択してください');
      }
    },
    
    async scanImage() {
      if (!this.selectedFile) {
        alert('画像を選択してください');
        return;
      }
      
      const formData = new FormData();
      // 画像を 'image' という名前で追加
      formData.append('image', this.selectedFile);

      try {
        // POSTリクエストを送信
        const response = await axios.post('https://artifact-simulator-docker.onrender.com/scan-img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob', // 画像データをblob形式で取得
        });

        // 画像データをURLとして表示
        const imageUrl = URL.createObjectURL(response.data);
        this.imageUrl = imageUrl;
      } catch (error) {
        console.error('画像スキャンに失敗しました:', error);
      }
    },
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
  height: 100vh;
  width: 100vw;

  background-image: url(./assets/background.png);
  background-repeat: repeat;
  background-size: calc(200vw / 5.0) calc(200vw / 5.0);
}

#app {
  padding-top: min(calc(50vh / 5.0), 50px);

  display: flex;
  flex-direction: column; /* 上下方向に要素を並べる */
  align-items: center; /* 子要素を水平方向に中央寄せ */
  height: 100vh; /* 画面全体の高さを確保 */
  text-align: center;
}

/* 以下、既存のスタイル */
#img-upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.def-button {
  padding: 10px 20px;
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

  transition-duration: 100ms;
}

.def-button:hover {
  background-color: #424858;
  transform: scale(0.99, 0.99) translateY(2px);
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
  height: fit-content;
  max-width: 80%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

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

  flex: 1; /* 各 div が均等に幅を取るようにする */
  display: flex;
  flex-direction: column; /* ラジオボタンを縦に並べる */
  justify-items: center;
  align-items: center;

  background-color: #495366;
  box-shadow: 3px 5px 5px rgb(0 0 0 / 70%);
}


#artifact-img {
  margin-bottom: min(calc(22vw / 5), 30px);

  width: min(calc(150vw / 5), 320px);
  height: auto;

  box-shadow: 5px 5px 5px rgb(0 0 0 / 70%);
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

#reinforce-select {
  padding: min(calc(5vw / 5), 8px);
  margin: 0px min(calc(9vw / 5), 16px) min(calc(9vw / 5), 16px);

  font-size: min(calc(9vw / 5), 16px);
  background-color: #4B5368;
  color: white;
  border-radius: 5px;
  border: none;
  outline: none;
  cursor: pointer;
  width: 80%;
  appearance: none;
  transition: background-color 0.3s ease;
}

/* reinforce-num-areaのアニメーション */

#reinforce-select:hover {
  background-color: #424858;
}

#reinforce-select:focus {
  background-color: #3a404f;
  border: 1px solid #d3bb8f;
}

/* セレクトボックスの矢印 */
#reinforce-select::-ms-expand {
  display: none;
}

#reinforce-select option {
  background-color: #4B5368;
  color: white;
}

/* ここまでアニメーション */

</style>
