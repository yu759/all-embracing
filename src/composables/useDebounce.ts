import { ref, watch, type Ref } from 'vue'

// 使用泛型 T，并显式注明参数 value 是一个 Ref 类型
export function useDebounce<T>(value: Ref<T>, delay = 500): Ref<T> {
  // 1. 移除不必要的类型断言 `as Ref<T>`，ref() 的返回值类型推断是准确的
  const debouncedValue = ref(value.value) as Ref<T>
  
  // 2. 将 timer 的类型从 NodeJS.Timeout 改为 number
  // 浏览器环境中的 setTimeout 返回的是 number 类型
  let timer: number | null = null

  watch(value, (newVal) => {
    if (timer) clearTimeout(timer)
     setTimeout(() => {
      debouncedValue.value = newVal
    }, delay)
  })

  // 显式声明函数返回一个 Ref<T>
  return debouncedValue
}