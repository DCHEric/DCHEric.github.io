/* 深浅模式切换功能 */
(function() {
  const STORAGE_KEY = 'theme-mode';

  // 获取当前主题模式
  function getThemeMode() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // 应用主题模式
  function applyTheme(mode) {
    const root = document.documentElement;

    // 移除旧类名
    root.classList.remove('light-mode', 'dark-mode');

    // 添加新类名
    root.classList.add(mode + '-mode');

    // 保存选择
    localStorage.setItem(STORAGE_KEY, mode);

    // 更新按钮图标
    const icon = document.querySelector('.theme-toggle-icon');
    if (icon) {
      icon.className = mode === 'dark' ? 'fa fa-sun theme-toggle-icon' : 'fa fa-moon theme-toggle-icon';
    }
  }

  // 切换主题
  function toggleTheme() {
    const current = getThemeMode();
    const newMode = current === 'dark' ? 'light' : 'dark';
    applyTheme(newMode);
  }

  // 页面加载时应用保存的主题（在 DOMContentLoaded 之前执行，避免闪烁）
  applyTheme(getThemeMode());

  // 等待 DOM 加载完成后添加按钮
  document.addEventListener('DOMContentLoaded', function() {
    // 创建切换按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.setAttribute('aria-label', '切换深浅模式');
    toggleBtn.innerHTML = '<i class="fa fa-moon theme-toggle-icon"></i>';
    toggleBtn.onclick = toggleTheme;

    // 添加到页面
    document.body.appendChild(toggleBtn);

    // 初始化图标
    const mode = getThemeMode();
    const icon = toggleBtn.querySelector('.theme-toggle-icon');
    icon.className = mode === 'dark' ? 'fa fa-sun theme-toggle-icon' : 'fa fa-moon theme-toggle-icon';
  });
})();
