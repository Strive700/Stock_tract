<template>
  <div class="widget quick-access">
    <div class="widget-header">
      <h3>快捷访问</h3>
    </div>
    <div class="widget-content">
      <div class="shortcut-grid">
        <router-link to="/market" class="shortcut-item">
          <i class="iconfont icon-chart-screen"></i>
          <span>股票行情</span>
        </router-link>
        <router-link to="/position" class="shortcut-item">
          <i class="iconfont icon-jiaoyisuo"></i>
          <span>交易中心</span>
        </router-link>
        <router-link to="/securities" class="shortcut-item">
          <i class="iconfont icon-zhengquanxinxi"></i>
          <span>证券信息</span>
        </router-link>
        <router-link to="/orders" class="shortcut-item">
          <i class="iconfont icon-dingdanguanli"></i>
          <span>订单管理</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.widget {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  margin-bottom: 20px;
}
.widget-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.widget-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}
.widget-content {
  padding: 16px;
}
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.shortcut-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
}
.shortcut-item:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}
.shortcut-item i {
  font-size: 24px;
  color: #1890ff;
  margin-bottom: 8px;
}
</style> 