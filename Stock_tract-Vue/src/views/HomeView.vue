<template>
  <div class="home-view">
    <div class="welcome">
      <h2>欢迎使用股票交易系统</h2>
      <p>请从左侧菜单选择需要的功能</p>
    </div>
    <div class="dashboard-row">
      <market-overview />
      <news-widget />
      <quick-access />
    </div>
  </div>
</template>

<script setup lang="ts">
import MarketOverview from '../components/MarketOverview.vue'
import NewsWidget from '../components/NewsWidget.vue'
import QuickAccess from '../components/QuickAccess.vue'
import { onMounted, ref } from 'vue'
import request from '../utils/request'
import router from '../router'
import { useToast } from 'vue-toastification' 
import { useUserStore } from '../stores/user'
const toast = useToast()
const userStore = useUserStore()
onMounted(async () => {
  try {
    const response = await request.get('/isLogin') 
    if(response!== null && response.data && response.data.user) {
      // 如果获取到用户信息，设置到 Pinia store，防止页面刷新后数据丢失
    userStore.setUser(response.data.user)
    userStore.setAccount(response.data.account)
      // 这里可以添加其他初始化逻辑
    } else {
      // 如果没有获取到用户信息，抛出错误
      throw new Error('未获取到用户信息')
    }
  } catch (err) {
    toast.error('您尚未登录，请先登录')
        setTimeout(() => {
      router.push('/login') 
    }, 1500)
  }
})
</script>

<style scoped>
.home-view {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  padding: 20px;
  box-sizing: border-box;
  gap: 24px;
}

.welcome {
  width: 100%;
  max-width: 1200px;
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.welcome h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 12px;
  color: #222;
}

.welcome p {
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: #666;
}

.dashboard-row {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 0 20px;
  box-sizing: border-box;
}

.dashboard-row > * {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  box-sizing: border-box;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: #222;
  height: 100%;
  min-height: 200px;
}

.dashboard-row > *:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

/* 响应式布局调整 */
@media (max-width: 1024px) {
  .home-view {
    padding: 15px;
  }
  
  .dashboard-row {
    gap: 20px;
    padding: 0 15px;
  }
}

@media (max-width: 768px) {
  .home-view {
    padding: 10px;
  }
  
  .welcome {
    padding: 15px;
  }
  
  .dashboard-row {
    gap: 15px;
    padding: 0 10px;
  }
  
  .dashboard-row > * {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .home-view {
    padding: 5px;
  }
  
  .welcome {
    padding: 10px;
  }
  
  .dashboard-row {
    gap: 10px;
    padding: 0 5px;
  }
  
  .dashboard-row > * {
    padding: 10px;
  }
}
</style> 