// import { defineStore } from 'pinia';
// import { reactive, ref, computed } from 'vue';

// export const useEncyclopediaStore = defineStore('encyclopedia', () => {
//   // --- 1. 默认设置定义 (用于重置) ---
//   const DEFAULT_SETTINGS = {
//     fontSize: 16,
//     lineHeight: 1.5,
//     theme: 'default', // 'default' | 'parchment' | 'midnight'
//     eyeCare: false,
//     volume: 50,
//     ambientType: '无', // '森林' | '雨声' | '深海' | '星空'
//     clickSound: true,
//     featureSound: true,
//     visibility: 'public',
//     hideBadges: false,
//   };

//   // --- 2. 状态 (State) ---
  
//   // 核心设置：从本地存储读取，若无则使用默认值
//   const settings = reactive({
//     ...DEFAULT_SETTINGS,
//     ...JSON.parse(localStorage.getItem('ency_settings') || '{}')
//   });

//   // 百科内容数据缓存
//   const collections = reactive({
//     flowers: [],
//     stars: [],
//     books: [],
//     loading: false
//   });

//   // --- 3. 计算属性 (Getters) ---
  
//   // 统一输出阅读样式的 Computed
//   const readingStyles = computed(() => {
//     const themeMap = {
//       default: { bg: 'rgba(255,255,255,0.05)', text: '#f8fafc' },
//       parchment: { bg: '#f4e4bc', text: '#5d4037' },
//       midnight: { bg: '#0f172a', text: '#94a3b8' }
//     };
    
//     const theme = themeMap[settings.theme];
//     return {
//       fontSize: `${settings.fontSize}px`,
//       lineHeight: settings.lineHeight,
//       backgroundColor: theme.bg,
//       color: theme.text,
//       filter: settings.eyeCare ? 'sepia(0.4) saturate(0.9)' : 'none',
//       transition: 'all 0.3s ease'
//     };
//   });

//   // --- 4. 行为 (Actions) ---

//   /**
//    * 更新单个设置项并持久化
//    * @param {string} key 键名
//    * @param {any} value 键值
//    */
//   const updateSetting = (key, value) => {
//     if (key in settings) {
//       settings[key] = value;
//       // 实时存入本地缓存
//       localStorage.setItem('ency_settings', JSON.stringify(settings));
//     }
//   };

//   /**
//    * 通用数据拉取逻辑 (带缓存机制)
//    * @param {string} category 分类名称
//    */
//   const fetchCategoryData = async (category) => {
//     // 缓存拦截：如果该分类已有数据，直接返回
//     if (collections[category] && collections[category].length > 0) return;

//     collections.loading = true;
//     try {
//       // 模拟异步 API 延迟
//       await new Promise(resolve => setTimeout(resolve, 800));
      
//       // 这里未来替换为真实接口: axios.get(`/api/${category}`)
//       const mockData = Array.from({ length: 6 }).map((_, i) => ({
//         id: `${category}-${i}`,
//         title: `${category}百科条目 ${i + 1}`,
//         description: `这是关于${category}的深度解析内容...`,
//         cover: `https://picsum.photos/seed/${category}${i}/400/300`
//       }));

//       collections[category] = mockData;
//     } catch (error) {
//       console.error(`加载 ${category} 数据失败:`, error);
//     } finally {
//       collections.loading = false;
//     }
//   };

//   /**
//    * 危险操作：重置所有设置
//    */
//   const resetSettings = () => {
//     Object.assign(settings, DEFAULT_SETTINGS);
//     localStorage.removeItem('ency_settings');
//   };

//   return {
//     settings,
//     collections,
//     readingStyles,
//     updateSetting,
//     fetchCategoryData,
//     resetSettings
//   };
// });