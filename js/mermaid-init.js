/* 初始化文章中的 Mermaid 图表，并根据系统外观选择主题。 */
(function () {
  'use strict';

  /** 将页面中的 Mermaid 源码节点渲染为 SVG。 */
  function renderMermaidDiagrams() {
    var nodes = document.querySelectorAll('pre.mermaid');
    if (!nodes.length || !window.mermaid) return;

    var prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    window.mermaid.initialize({
      startOnLoad: false,
      theme: prefersDark ? 'dark' : 'default',
      securityLevel: 'strict',
      flowchart: {
        htmlLabels: true,
        useMaxWidth: true
      }
    });

    window.mermaid.run({ nodes: nodes }).catch(function (error) {
      console.error('Mermaid 图表渲染失败：', error);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderMermaidDiagrams);
  } else {
    renderMermaidDiagrams();
  }
})();
