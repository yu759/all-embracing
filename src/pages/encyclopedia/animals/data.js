// 1. 定义分类常量
const SPECIES_GROUPS = [
  { id: 'all', label: '全部物种', icon: '🐾', theme: '#4caf50' },
  { id: 'terrestrial', label: '陆地动物', icon: '🌲', theme: '#2e7d32' },
  { id: 'marine', label: '海洋生物', icon: '🌊', theme: '#0277bd' },
  { id: 'birds', label: '飞禽羽类', icon: '🦅', theme: '#bf360c' },
  { id: 'amphibians', label: '两栖爬行', icon: '🦎', theme: '#3e2723' }
];

// 2. 重新编排的数据
const ANIMAL_DATABASE = [
  // 陆地类
  { name: "东北虎", type: "terrestrial", category: "猫科", habitat: "针阔混交林", trait: "森林之王", status: "极危", pop: 12, keyword: "tiger", color: "#f57c00" },
  { name: "大熊猫", type: "terrestrial", category: "熊科", habitat: "高山竹林", trait: "活化石", status: "易危", pop: 45, keyword: "giantpanda", color: "#2e7d32" },
  // 海洋类
  { name: "座头鲸", type: "marine", category: "须鲸科", habitat: "全球大洋", trait: "海洋歌手", status: "无危", pop: 60, keyword: "whale", color: "#0277bd" },
  { name: "大白鲨", type: "marine", category: "鲭鲨科", habitat: "热带海域", trait: "顶级掠食者", status: "易危", pop: 35, keyword: "shark", color: "#455a64" },
  // 飞禽类
  { name: "金雕", type: "birds", category: "鹰科", habitat: "高山悬崖", trait: "空中霸主", status: "一级保护", pop: 40, keyword: "eagle", color: "#bf360c" },
  { name: "朱鹮", type: "birds", category: "鹮科", habitat: "湿地稻田", trait: "东方宝石", status: "濒危", pop: 50, keyword: "ibis", color: "#ff8a80" },
  // 两栖爬行
  { name: "扬子鳄", type: "amphibians", category: "鳄目", habitat: "长江流域", trait: "史前遗民", status: "极危", pop: 15, keyword: "crocodile", color: "#3e2723" },
  { name: "红眼树蛙", type: "amphibians", category: "雨蛙科", habitat: "热带雨林", trait: "色彩大师", status: "无危", pop: 75, keyword: "frog", color: "#64dd17" }
];