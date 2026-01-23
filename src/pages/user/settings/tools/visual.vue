<template>
  <div class="tool-detail-content">
    <div class="setting-group glass">
      <div class="setting-row">
        <div
          :style="{
            fontSize: '24px',
            color: '#f8fafc',
            marginLeft: '20px',
            marginTop: '20px',
          }"
        >
          渲染质量
        </div>
        <div class="adjust-content">
          <span>调整毛玻璃模糊半径与动画复杂度</span>
          <span>
            <a-segmented
              v-model:value="visualState.quality"
              :options="qualityOptions"
              size="small"
              block
              :style="{
                width: '200px',
              }"
              @change="handleQualityChange"
            />
          </span>
        </div>
      </div>
      <div class="setting-row">
        <!-- 改为使用单独的容器来渲染Mermaid -->
        <div class="markdown-content" v-html="renderedHtmlWithoutMermaid"></div>
        <div
          v-if="mermaidContent"
          class="mermaid-container"
          ref="mermaidContainer"
        >
          <div class="mermaid" ref="mermaidElement">
            <a-carousel autoplay :autoplaySpeed="3000" effect="fade"
              ><div v-for="(p, index) in pages" :key="index">
                <div :src="p.url" :alt="p.alt">{{ p.mermaidContent }}</div>
              </div></a-carousel
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from "vue";
import visualContent from "@/assets/visual/visual.md?raw";
import mermaid from "mermaid";
import MarkdownIt from "markdown-it";

// 渲染质量选项
const qualityOptions = [
  { label: "流畅", value: "low" },
  { label: "标准", value: "medium" },
  { label: "极致", value: "high" },
];

// 状态管理
const visualState = reactive({
  quality: "medium",
});

// DOM 引用
const mermaidElement = ref(null);
const mermaidContainer = ref(null);

const pages = [{ url: "./sunFlower.vue", alt: "canvas生成图片" }, {}];

// 提取Mermaid内容
const mermaidContent = computed(() => {
  // 从markdown内容中提取mermaid代码块
  const mermaidMatch = visualContent.match(/```mermaid\n([\s\S]*?)\n```/);
  return mermaidMatch ? mermaidMatch[1].trim() : null;
});

// 移除Mermaid内容后的Markdown
const renderedHtmlWithoutMermaid = computed(() => {
  // 移除mermaid代码块
  const contentWithoutMermaid = visualContent.replace(
    /```mermaid[\s\S]*?```/g,
    ""
  );

  // 配置 MarkdownIt
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && lang !== "mermaid") {
        return `<pre><code class="language-${lang}">${md.utils.escapeHtml(
          str
        )}</code></pre>`;
      }
      return ""; // 不处理mermaid，留空
    },
  });

  // 渲染Markdown
  let html = md.render(contentWithoutMermaid);

  // 添加一些自定义样式类
  html = html
    .replace(/<table>/g, '<table class="markdown-table">')
    .replace(/<code>(?!<)/g, '<code class="inline-code">');

  return html;
});

// 初始化 Mermaid
const initializeMermaid = () => {
  const config = {
    theme: "dark",
    startOnLoad: false, // 手动初始化
    securityLevel: "loose",
    fontFamily: "inherit",
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve:
        visualState.quality === "low"
          ? "linear"
          : visualState.quality === "high"
          ? "cardinal"
          : "basis",
    },
    themeCSS: `
      .node rect {
        fill: rgba(30, 41, 59, 0.8) !important;
        stroke: #2dd4bf !important;
        stroke-width: 2px !important;
      }
      .node polygon {
        fill: rgba(45, 212, 191, 0.2) !important;
        stroke: #2dd4bf !important;
        stroke-width: 2px !important;
      }
      .edgePath path {
        stroke: #94a3b8 !important;
        stroke-width: 2px !important;
      }
      .edgeLabel {
        background-color: rgba(30, 41, 59, 0.8) !important;
        color: #cbd5e1 !important;
      }
    `,
  };

  mermaid.initialize(config);
};

// 渲染 Mermaid 图表
const renderMermaidChart = async () => {
  if (!mermaidElement.value || !mermaidContent.value) {
    console.warn("Mermaid element or content not found");
    return;
  }

  try {
    // 清除之前的内容
    mermaidElement.value.innerHTML = "";
    mermaidElement.value.textContent = mermaidContent.value;

    // 移除可能的处理标记
    mermaidElement.value.removeAttribute("data-processed");

    // 使用 mermaid.render 来渲染
    const { svg, bindFunctions } = await mermaid.render(
      "mermaid-chart-" + Date.now(),
      mermaidContent.value
    );

    mermaidElement.value.innerHTML = svg;
    if (bindFunctions) {
      bindFunctions(mermaidElement.value);
    }

    console.log("Mermaid chart rendered successfully");
  } catch (error) {
    console.error("Mermaid渲染失败:", error);
    mermaidElement.value.innerHTML = `<div class="mermaid-error">图表渲染失败: ${error.message}<pre>${mermaidContent.value}</pre></div>`;
  }
};

// 处理质量变化
const handleQualityChange = async () => {
  console.log("Quality changed to:", visualState.quality);
  initializeMermaid();
  await renderMermaidChart();
};

// 组件挂载时初始化
onMounted(async () => {
  console.log("Component mounted, initializing mermaid...");

  // 等待DOM更新
  await nextTick();

  // 初始化Mermaid配置
  initializeMermaid();

  // 如果有Mermaid内容，渲染图表
  if (mermaidContent.value) {
    setTimeout(async () => {
      await renderMermaidChart();
    }, 300);
  }
});

// 监听Mermaid内容变化
watch(mermaidContent, (newVal) => {
  if (newVal) {
    nextTick(() => {
      setTimeout(async () => {
        await renderMermaidChart();
      }, 100);
    });
  }
});
</script>

<style lang="less" scoped>
@import "../style.less";

.tool-detail-content {
  padding: 20px;

  .setting-group {
    .setting-row {
      .adjust-content {
        color: rgba(248, 250, 252, 0.6);
        margin-left: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      }

      .markdown-content {
        min-height: 100px;
        background: transparent;
        color: #cbd5e1;
        font-family: inherit;
        line-height: 1.6;
      }

      .mermaid-container {
        min-height: 300px;
        background: rgba(30, 41, 59, 0.3);
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        overflow: auto;
        border: 1px solid rgba(255, 255, 255, 0.1);

        .mermaid {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          width: 100%;

          svg {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
          }

          .mermaid-error {
            color: #f87171;
            padding: 20px;
            text-align: center;
            font-style: italic;

            pre {
              background: rgba(248, 113, 113, 0.1);
              padding: 10px;
              border-radius: 4px;
              margin-top: 10px;
              text-align: left;
              overflow-x: auto;
            }
          }
        }
      }

      // Markdown内容样式
      :deep(.markdown-content) {
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          color: #f8fafc;
          margin: 20px 0 10px 0;
        }

        h1 {
          border-bottom: 2px solid #2dd4bf;
          padding-bottom: 10px;
          font-size: 2em;
        }

        h2 {
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding-bottom: 8px;
          font-size: 1.6em;
        }
        /* 强制覆盖所有 Mermaid 节点样式 */
        :deep(.mermaid) {
          rect,
          circle,
          polygon,
          ellipse,
          path {
            stroke: none !important;
            fill: none !important;
          }

          /* 针对有文字的节点 */
          .nodeLabel,
          .label,
          text {
            font-family: monospace !important;
          }
        }

        /* 或者更具体地针对您的图 */
        :deep(.mermaid) g.node rect {
          display: none !important;
        }

        :deep(.mermaid) g.node > g > rect {
          opacity: 0 !important;
        }

        .markdown-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;

          th,
          td {
            padding: 12px 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          th {
            background: rgba(45, 212, 191, 0.2);
            color: #f8fafc;
            font-weight: 600;
          }

          tr:nth-child(even) {
            background: rgba(255, 255, 255, 0.05);
          }
        }

        .inline-code {
          background: rgba(45, 212, 191, 0.1);
          color: #2dd4bf;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "Monaco", "Consolas", monospace;
          font-size: 0.9em;
        }

        pre {
          background: rgba(30, 41, 59, 0.7) !important;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px;
          overflow: auto;

          code {
            background: transparent !important;
            color: #cbd5e1 !important;
            font-family: "Monaco", "Consolas", monospace;
          }
        }

        blockquote {
          border-left: 4px solid #2dd4bf;
          background: rgba(45, 212, 191, 0.1);
          color: #94a3b8;
          padding: 15px 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }

        ul,
        ol {
          padding-left: 25px;
          margin: 15px 0;

          li {
            margin: 8px 0;

            &::marker {
              color: #2dd4bf;
            }
          }
        }

        a {
          color: #2dd4bf;
          text-decoration: none;
          border-bottom: 1px dashed rgba(45, 212, 191, 0.3);
          transition: all 0.3s;

          &:hover {
            color: #5eead4;
            border-bottom-color: #5eead4;
          }
        }
      }
    }
  }
}
</style>