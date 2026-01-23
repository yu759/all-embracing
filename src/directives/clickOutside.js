// src/directives/clickOutside.js
export const clickOutside = {
  mounted(el, binding) {
    // 定义点击事件处理函数
    el._clickOutsideHandler = (event) => {
      // 如果点击事件发生在指令绑定的元素内部，则不执行
      if (!(el === event.target || el.contains(event.target))) {
        // 调用绑定的值（应该是一个函数）
        binding.value(event);
      }
    };
    // 添加事件监听，使用捕获阶段确保先执行
    document.addEventListener('click', el._clickOutsideHandler, true);
  },
  unmounted(el) {
    // 组件卸载时，清理事件监听，防止内存泄漏
    document.removeEventListener('click', el._clickOutsideHandler, true);
  }
};