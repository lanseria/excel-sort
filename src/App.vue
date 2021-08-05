<template>
  <n-grid cols="8 s:8 m:8 l:8 xl:4 2xl:4" :y-gap="8" responsive="screen">
    <n-gi offset="l:2 xl:1 2xl:1" span="8 s:8 m:8 l:4 xl:2 2xl:2">
      <n-upload
        v-if="!showJsonTable"
        accept=".xls"
        :show-file-list="false"
        @before-upload="handleBeforeUpload"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <FileExcelOutlinedIcon />
            </n-icon>
          </div>
          <n-text style="font-size: 16px"
            >点击或者拖动文件到该区域来上传</n-text
          >
          <n-p depth="3" style="margin: 8px 0 0 0"
            >请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码</n-p
          >
        </n-upload-dragger>
      </n-upload>
      <n-data-table
        v-else
        ref="table"
        :columns="columns"
        :data="dataTable"
        max-height="70vh"
        virtual-scroll
      />
    </n-gi>
    <n-gi offset="1 s:1 m:1 l:2 xl:1 2xl:1" span="6 s:6 m:6 l:4 xl:2 2xl:2">
      <n-space>
        <n-button type="primary" @click="sortByKey()">排序</n-button>
        <n-button @click="downloadFile()">下载</n-button>
      </n-space>
    </n-gi>
  </n-grid>
  <ReloadPrompt />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NP,
  NGrid,
  NGi,
  NButton,
  NDataTable,
  NSpace,
} from "naive-ui";
import { FileExcelOutlined as FileExcelOutlinedIcon } from "@vicons/antd";
import ReloadPrompt from "./ReloadPrompt.vue";
import xlsx from "xlsx";
import { orderBy } from "lodash-es";
export default defineComponent({
  name: "App",
  components: {
    NUpload,
    NUploadDragger,
    NIcon,
    NText,
    NP,
    NGrid,
    NGi,
    NButton,
    NDataTable,
    NSpace,
    FileExcelOutlinedIcon,
    ReloadPrompt,
  },
  setup() {
    const dataTable = ref<any[]>([]);
    let dataTableHeader = {};
    const showJsonTable = ref(false);
    const handleBeforeUpload = ({ file }: any) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = ev.target?.result;
        const workBook = xlsx.read(data, { type: "binary" });
        const v = workBook.Sheets[workBook.SheetNames[0]];
        const j: any[] = xlsx.utils.sheet_to_json(v, {
          defval: "",
          header: ["key", "name", "deptName", "type", "amount"],
        });
        dataTableHeader = j.shift();
        dataTable.value = j;
        showJsonTable.value = true;
      };
      reader.readAsBinaryString(file.file);
    };
    const sortByKey = () => {
      dataTable.value = orderBy(dataTable.value, function (o) {
        return Number(o.key);
      });
    };
    const downloadFile = () => {
      const wb = xlsx.utils.book_new();
      dataTable.value.unshift(dataTableHeader);
      const ws = xlsx.utils.json_to_sheet(dataTable.value, {
        skipHeader: true,
      });
      console.log(ws["!ref"]);
      xlsx.utils.book_append_sheet(wb, ws, "Results");
      return xlsx.writeFile(wb, "1.xls");
    };
    return {
      // const
      columns: [
        {
          title: "卡号",
          key: "key",
        },
        {
          title: "姓名",
          key: "name",
        },
        {
          title: "部门名称",
          key: "deptName",
        },
        {
          title: "补贴类型",
          key: "type",
        },
        {
          title: "补贴金额",
          key: "amount",
        },
      ],
      // ref
      showJsonTable,
      dataTable,
      // method
      handleBeforeUpload,
      sortByKey,
      downloadFile,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
