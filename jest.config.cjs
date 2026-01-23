// jest.config.js
module.exports = {
  // 预设：使用 vue-cli 的 jest 预设，简化配置
  preset: '@vue/cli-plugin-unit-jest',

  // 测试文件匹配规则
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],

   moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    // 如果重命名为 .cjs，请加上下面这行
    'cjs',
    // Vue 文件
    'vue'
  ],

  // 模块名映射（与 webpack 的 alias 对应）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // 模拟静态资源，避免导入文件时报错
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },

  // 测试覆盖率设置
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js', // 排除入口文件
    '!**/node_modules/**'
  ],
  coverageReporters: ['html', 'text-summary'],

  // 指定测试环境
  testEnvironment: 'jsdom'

  
}