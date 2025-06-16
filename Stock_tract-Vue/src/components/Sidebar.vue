<template>
  <div class="sidebar">
    <div class="logo">
      <i class="iconfont icon-gupiao"></i>
      <span>StockTrading</span>
    </div>
    <nav class="menu">
      <router-link to="/home" class="menu-item" active-class="active" exact>
        <i class="iconfont icon-zhuyemian"></i>
        <span>主页面</span>
      </router-link>
      <router-link to="/market" class="menu-item" active-class="active">
        <i class="iconfont icon-chart-screen"></i>
        <span>股票行情</span>
      </router-link>
      <router-link to="/position" class="menu-item" active-class="active">
        <i class="iconfont icon-chicang"></i>
        <span>持仓</span>
      </router-link>
      <router-link to="/securities" class="menu-item" active-class="active">
        <i class="iconfont icon-zhengquanxinxi"></i>
        <span>证券信息</span>
      </router-link>
      <router-link to="/orders" class="menu-item" active-class="active">
        <i class="iconfont icon-dingdanguanli"></i>
        <span>订单管理</span>
      </router-link>
      <router-link to="/index-chart" class="menu-item" active-class="active">
        <i class="iconfont icon-chart-screen"></i>
        <span>指数行情</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
}
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: #002140;
  font-size: 18px;
  font-weight: bold;
}
.logo i {
  margin-right: 8px;
  color: #1890ff;
  font-size: 20px;
}
.menu {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #e6e6e6;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}
.menu-item i:first-child {
  font-size: 16px;
  margin-right: 10px;
  width: 16px;
  text-align: center;
}
.menu-item span {
  flex: 1;
}
.menu-item:hover, .menu-item.active {
  color: #fff;
  background-color: #1890ff;
}
</style> 