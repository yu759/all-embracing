import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
  // 状态
  const user = ref<{ id: number; name: string; email: string } | null>(null);
  const token = ref<string>('');
  const isInitialized = ref<boolean>(false);
  
  // Getters
  const isLoggedIn = computed(() => !!token.value && !!user.value);
  
  // Actions
  const initApp = () => {
    
    // 从 localStorage 恢复用户状态
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken) {
      token.value = savedToken;
    }
    
    if (savedUser) {
      user.value = JSON.parse(savedUser);
    }
    
    isInitialized.value = true;
  };
  
  const login = (username: string, password: string) => {
    // 模拟登录
    const mockUser = {
      id: 1,
      name: '测试用户',
      email: 'test@example.com'
    };
    
    user.value = mockUser;
    token.value = 'mock-token-123456';
    
    // 保存到 localStorage
    localStorage.setItem('token', token.value);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return { success: true, user: mockUser };
  };
  
  const logout = () => {
    user.value = null;
    token.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  return {
    // 状态
    user,
    token,
    isInitialized,
    
    // Getters
    isLoggedIn,
    
    // Actions
    initApp,
    login,
    logout
  };
});