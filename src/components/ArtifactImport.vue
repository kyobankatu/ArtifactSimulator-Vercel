<template>
  <div style="display: flex; align-items: center; justify-items: center;">
    <p style="font-size: min(calc(14vw / 5), 20px); color: #3a404f;">聖遺物インポート</p>
    <button class="info-icon" @click="$emit('show-info')">
      <img src="../assets/info.webp" alt="Info"/>
    </button>
  </div>
  
  <div id="img-upload-area">
    <!-- ファイル選択を隠してラベルをクリック可能にする -->
    <label for="artifact-select" class="def-button" style="font-size: min(calc(9vw / 5), 16px);">ファイルを選択</label>
    <input type="file" id="artifact-select" @change="$emit('file-change', $event)" accept="image/png" style="display: none;"/>
    <input type="text" id="artifact-img-name" :value="fileName" style="font-size: min(calc(9vw / 5), 16px);" readonly placeholder="ファイル名" />
    <button class="def-button" style="font-size: min(calc(9vw / 5), 16px);" @click="$emit('scan-image')">スキャン</button>
  </div>
</template>

<script>
export default {
  name: "ArtifactImport",
  props: {
    fileName: String
  },
  emits: ["file-change", "scan-image"]
}
</script>